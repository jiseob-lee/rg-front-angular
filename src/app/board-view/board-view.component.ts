import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import { isPlatformServer } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';

import { NgZone } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, withLatestFrom, filter, pairwise } from 'rxjs/operators';

import { BoardService } from '../board.service';
import { EnvironmentService } from '../environment.service';

import { Article } from '../article';
import { Board } from '../board';
import { BoardContent } from '../boardContent';
import { Attachment } from '../attachment';

import { CookieService } from 'ngx-cookie-service';

import { Title } from '@angular/platform-browser';

import { UserCommentsComponent } from '../user-comments/user-comments.component';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-board-view',
    templateUrl: './board-view.component.html',
    styleUrls: ['./board-view.component.css'],
	imports: [FormsModule, CommonModule, UserCommentsComponent],
    standalone: true
})
export class BoardViewComponent implements OnInit {

  boardNo: number = 0;
  pageNo: number = 0;
  boardArticleIdx: number = 0;
  //boardContent: BoardContent = new BoardContent(0, 0, "", "", "", "", "", 0, "", "", "", "", "", "", "", "");
  //boardContent: BoardContent = new BoardContent();
  boardContent: Observable<BoardContent | null> = of(null);

  locale: string = "";
  loginId: string = "";

  lang: string = "";

  attachmentList: Attachment[] = [];

  csrfToken: string = "";

  cookiePath: string = "";

  routerURL: string = "";
  routerArray: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private environmentService: EnvironmentService,
    private cookieService: CookieService,
    private router: Router,
    //private route1: Router,
    //@Inject(PLATFORM_ID) private platformId,
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
	private ngZone: NgZone,
	private sanitizer: DomSanitizer
  ) {

    //this.routeEvent(this.router);
  }

  routeEvent(router: Router){
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd){
        //console.log("routeEvent 3", e);

	this.routerURL = this.router.url;

        //console.log("routerURL 3", this.routerURL);

        var routerArray = this.routerURL.split("/");
        routerArray.splice(0, 1);
	this.routerArray = routerArray;

        if (this.routerArray[this.routerArray.length - 1] == "ko" || this.routerArray[this.routerArray.length - 1] == "en") {
	    this.lang = this.routerArray[this.routerArray.length - 1];
	}

	//console.log("routerURL 3-1", this.lang);
      }
    },
    () => {},
    () => {

    }
    );
  }

  ngOnInit() {

    this.environmentService.getEmptyRequest().subscribe(
      response => {
        //console.log("빈 요청 3-1", response);
	//console.log("빈 요청 3-2", response.RequestURI);
      }
    );

    let boardNo = Number(this.route.snapshot.paramMap.get('boardNo'));
    let pageNo = Number(this.route.snapshot.paramMap.get('pageNo'));
    let boardArticleIdx = Number(this.route.snapshot.paramMap.get('boardArticleIdx'));
    let lang = this.route.snapshot.paramMap.get('lang') == null ? "" : this.route.snapshot.paramMap.get('lang')!;

    if (!(lang == null || lang == "" || lang == "ko" || lang == "en")) {
        lang = "";
    }
    
    /*
    const routes: Routes = [
      { path: '', redirectTo: 'board/list/0/1', pathMatch: 'full' },
      { path: 'board/list/:boardNo/:pageNo', component: BoardListComponent },
      { path: 'board/list/:boardNo/:pageNo/:lang', component: BoardListComponent },
      { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx', component: BoardViewComponent },
      { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx/:lang', component: BoardViewComponent }
    ];
    */


    this.boardNo = boardNo;
    this.pageNo = pageNo;
    this.boardArticleIdx = boardArticleIdx;

    this.lang = lang;

    if (this.lang == "ko" || this.lang == "en") {
      this.cookiePath = "/" + this.lang;
    } else if (this.cookieService.get("lang") != null && this.cookieService.get("lang") != "") {
      this.cookiePath = "/" + this.cookieService.get("lang");
      if (this.lang == "" || this.lang == null) {
        this.lang = this.cookieService.get("lang");
      }
    }

    //console.log("boardArticleIdx", this.boardArticleIdx);
    //console.log("lang 3", this.lang);

    //let test = document.getElementById("test");

    //this.router.events
    //.pipe(filter((e: any) => e instanceof RoutesRecognized),
      //pairwise()
    //).subscribe((e: any) => {
      //console.log("previous url", e[0].urlAfterRedirects); // previous url
    //});


    this.getEnvironmentInfo(lang);
    this.getAttachmentList(this.boardNo, this.boardArticleIdx);

  }

  getEnvironmentInfo(lang: string) : void {
    this.environmentService.getEnvironmentInfo(this.lang)
      .subscribe(response => {

          let locale = "";

	  //if (lang == "ko" || lang == "en") {
	    //locale = lang;
	  //} else {
	    //locale = response.locale;
	  //}

	  //this.locale = locale;

	  if (this.lang == "" || this.lang == null) {
	    this.locale = response.locale;
	  } else {
	    this.locale = this.lang;
	  }

	  //console.log("lang 3", this.lang);
	  //console.log("locale 3-1", this.locale);

	  this.loginId = response.loginId;

	  //this.getBoardContent(this.boardArticleIdx, locale);
        },
	() => {},
	() => {
	  this.getBoardContent(this.boardArticleIdx, this.locale);
	}
      );
  }

  getBoardContent(boardArticleIdx: number, locale: string): void {

    let path = "";

    let localePath = "";

    for (var i=0; i < this.route.snapshot.url.length; i++) {
	path += "/" + this.route.snapshot.url[i].path;

	if (i == this.route.snapshot.url.length - 1) {
	  localePath = this.route.snapshot.url[i].path;
	}
    }

    //let locale = this.locale;

    if (localePath == "ko" || localePath == "en") {
      this.locale = localePath;
    }

    let referrer = "";

    if (!isPlatformServer(this.platformId)) {
      //referrer = encodeURIComponent(document.referrer);
	  referrer = document.referrer;
    }

    /*
    this.boardService.getBoardContent(boardArticleIdx, path, referrer, this.locale)
      .subscribe(response => {
        this.boardContent = response;
		this.boardContent.contentSafe = this.sanitizer.bypassSecurityTrustHtml(this.boardContent.content);
		this.boardContent.contentEngSafe = this.sanitizer.bypassSecurityTrustHtml(this.boardContent.contentEng);
      },
      () => {},
      () => {

	//console.log("boardContent", this.boardContent);
	//console.log("locale 3-2", this.locale);

	if (this.locale == "en") {
	  this.titleService.setTitle( this.boardContent == null ? "" : this.boardContent.subjectEng );
	} else {
	  this.titleService.setTitle( this.boardContent == null ? "" : this.boardContent.subject );
	}
      }
    );
	*/

  this.boardContent = this.boardService
    .getBoardContent(boardArticleIdx, path, referrer, this.locale)
    .pipe(
      map(response => {
        if (!response) {
          return null;
        }

        return {
          ...response,
          contentSafe: this.sanitizer.bypassSecurityTrustHtml(response.content),
          contentEngSafe: this.sanitizer.bypassSecurityTrustHtml(response.contentEng),
        };
      }),
      tap(content => {
        if (!content) {
          this.titleService.setTitle('');
          return;
        }

        if (this.locale === 'en') {
          this.titleService.setTitle(content.subjectEng ?? '');
        } else {
          this.titleService.setTitle(content.subject ?? '');
        }
      })
    );
  
  }

  getAttachmentList(boardNo: number, boardArticleIdx: number): void {
    this.boardService.getAttachmentList(boardNo, boardArticleIdx)
      .subscribe(response => {
        this.attachmentList = response;
      },
      () => {},
      () => {
        //console.log("attachmentList", this.attachmentList);
      }
    );
  }

  goList() {
    //this.ngZone.run(() => {
      console.log("goList", `/board/list/${this.boardNo }/${this.pageNo }`);
      window.location.href = `/board/list/${this.boardNo }/${this.pageNo }${this.cookiePath }`;
      //window.location.href = 'your-url';
    //});
  }
}
