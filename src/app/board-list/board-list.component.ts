import { Component, OnInit, Input, ChangeDetectorRef, NgZone, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../message.service';

import { Observable, of, startWith, Subject } from 'rxjs';
import { catchError, map, tap, withLatestFrom, filter, takeUntil } from 'rxjs/operators';

import { BoardService } from '../board.service';
import { EnvironmentService } from '../environment.service';

import { Article } from '../article';
import { Board } from '../board';

import { CookieService } from 'ngx-cookie-service';

import { Title } from '@angular/platform-browser';

import { SharedService } from '../shared.service';

@Component({
    selector: 'app-board-list',
    templateUrl: './board-list.component.html',
    styleUrls: ['./board-list.component.css'],
	imports: [CommonModule],
    standalone: true
})
export class BoardListComponent implements OnInit, OnDestroy {

  //private list: Article[];
  list: Observable<Article[]> = of([]);
  listCount: Observable<number> = of(0);
  listLimit: number = 10;
  pageLinkCount: number = 10;  // pageLinkCount
  linkStart: number = 0;
  linkEnd: number = 0;
  linkArray: number[] = [];
  boardNo: number = 0;
  pageNo: number = 0;
  manageBoardList: Board[] = [];
  manageBoardObject: string[] = [];

  locale: string = "";
  loginId: string = "";

  lang: string = "";

  cookiePath: string = "";

  mainImage: string = "";

  routerURL: string = "";
  routerArray: string[] = [];

  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private messageService: MessageService,
    public environmentService: EnvironmentService,
    private cookieService: CookieService,
    private router: Router,
    private titleService: Title,
	private cdr: ChangeDetectorRef,
	private ngZone: NgZone,
	private sharedService: SharedService,
	@Inject(PLATFORM_ID) private platformId: Object
  ) {
    //this.routeEvent(this.router);
  }

  routeEvent(router: Router){
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd){
        //console.log("routeEvent 2", e);

        this.routerURL = this.router.url;

        //console.log("routerURL 2", this.routerURL);

        var routerArray = this.routerURL.split("/");
        routerArray.splice(0, 1);
        this.routerArray = routerArray;

        if (this.routerArray[this.routerArray.length - 1] == "ko" || this.routerArray[this.routerArray.length - 1] == "en") {
          this.lang = this.routerArray[this.routerArray.length - 1];
        }
      }
    });
  }

  ngOnInit() {

    //this.environmentService.getEmptyRequest().subscribe(
      //response => {
        //console.log("빈 요청 2-1", response);
	//console.log("빈 요청 2-2", response.RequestURI);
      //}
    //);
    
    this.boardNo = Number(this.route.snapshot.paramMap.get('boardNo'));
    this.pageNo = Number(this.route.snapshot.paramMap.get('pageNo'));
    this.lang = this.route.snapshot.paramMap.get('lang') == null ? "" : this.route.snapshot.paramMap.get('lang')!;

    if (!(this.lang == null || this.lang == "" || this.lang == "ko" || this.lang == "en")) {
        this.lang = "";
    }
    
    if (this.boardNo == 20) {
        this.mainImage = "20170530_173100.png";
    } else if (this.boardNo == 19) {
        this.mainImage = "DSC00052.png";
    } else if (this.boardNo == 10) {
        //this.mainImage = "20170529_103133.png";
	this.mainImage = "20170120_073643.png";
    } else {
        this.mainImage = "DSC00080_03.jpg";
    }

    console.log("this.mainImage : " + this.mainImage);

    //if (this.routerArray[this.routerArray.length - 1] == "ko" || this.routerArray[this.routerArray.length - 1] == "en") {
    if (this.lang == "ko" || this.lang == "en") {
      this.cookiePath = "/" + this.lang;
      //this.cookiePath = "/" + this.routerArray[this.routerArray.length - 1];
      console.log("cookiePath1", this.cookiePath);
    } else if (this.cookieService.get("lang") != null && this.cookieService.get("lang") != "") {
      this.cookiePath = "/" + this.cookieService.get("lang");
      console.log("cookiePath2", this.cookiePath);
      if (this.lang == "" || this.lang == null) {
        this.lang = this.cookieService.get("lang");
      }
    }

    console.log("routerURL 2-1", this.routerURL);

	this.sharedService.getManageBoardList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
		
        console.log("res", res);
		
		this.manageBoardList = res;
		
		for (var i=0; i < this.manageBoardList.length; i++) {
	      if (this.manageBoardList[i].articleCount == 0) {
	        this.manageBoardList.splice(i, 1);
	        i--;
	      } else {
	        this.manageBoardObject[this.manageBoardList[i].boardIdx] = this.manageBoardList[i].boardName;
		    this.cdr.detectChanges();
	      }
	    }
		
		this.getBoardList(this.boardNo, this.pageNo, this.lang);
      });
	
	
	if (isPlatformBrowser(this.platformId)) {
      this.getEnvironmentInfo();
	}
	
    //this.getManageBoardList();
    this.getBoardListCount(this.boardNo);
	//this.getBoardList(this.boardNo, this.pageNo, this.lang);
	//this.cdr.detectChanges();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  getEnvironmentInfo(): void {
    this.environmentService.getEnvironmentInfo(this.lang)
      .subscribe(response => {

	  if (this.lang == "" || this.lang == null) {
	    this.locale = response.locale;
		this.cdr.detectChanges();
	  } else {
	    this.locale = this.lang;
		this.cdr.detectChanges();
	  }

	  //console.log("EnvironmentInfo 2 : response.locale", response.locale);
	  //console.log("EnvironmentInfo 2 : this.lang", this.lang);
	  //console.log("EnvironmentInfo 2 : this.locale", this.locale);

	  this.loginId = response.loginId;
	  this.cdr.detectChanges();
	  //this.log(response.loginId);
        },
	() => {},
	() => {
          if (this.locale == "en") {
            this.titleService.setTitle( "Ji-Seob's homepage" );
          } else {
            this.titleService.setTitle( "이지섭 홈페이지" );
          }
		  //this.cdr.detectChanges();
	}
      );
  }

  getManageBoardList(): void {
    this.environmentService.getManageBoardList(this.lang).
      subscribe(
        response => {
          this.manageBoardList = response;
		  this.cdr.detectChanges();
        },
	() => {},
	() => {
	  for (var i=0; i < this.manageBoardList.length; i++) {
	    if (this.manageBoardList[i].articleCount == 0) {
	      this.manageBoardList.splice(i, 1);
	      i--;
	    } else {
	      this.manageBoardObject[this.manageBoardList[i].boardIdx] = this.manageBoardList[i].boardName;
		  this.cdr.detectChanges();
	    }
	  }
	  //console.log("목록을 가져온다. 시작.");
      
	  //this.getBoardList(this.boardNo, this.pageNo, this.lang);
	  
	  //this.cdr.detectChanges();
	}
      );
  }

getBoardList( boardNo: number, pageNo: number, lang: string): void {
  this.list = this.boardService.getBoardList(boardNo, pageNo, lang).pipe(
    map(response =>
      (response ?? []).map(item => ({
        ...item,
        boardName: this.manageBoardObject[item.boardIdx]
      }))
    ),
	tap(list1 => console.log("list1", list1)),
	startWith([])
  );
}


  getBoardListCount(boardNo: number): void {
	
    this.boardService.getBoardListCount(boardNo)
      .subscribe(response => {
		//this.ngZone.run(() => {
		//setTimeout(() => {
		this.listCount = of(response);
		this.cdr.detectChanges();
		//}, 0);
		//});
	  },
      () => {},
		  
      () => {
		

        //this.ngZone.run(() => {
		//this.listCount.pipe(map(value => {
		this.listCount.subscribe(value => {
        let pageEnd = Math.ceil(value / this.listLimit);  // 마지막 페이지 번호

        if (this.pageNo > pageEnd) {
          this.pageNo = pageEnd;
        }

        this.linkStart = Math.floor((this.pageNo - 1) / this.pageLinkCount) * this.pageLinkCount + 1;  // linkStart
        this.linkEnd = (pageEnd - this.linkStart > this.pageLinkCount) ? this.linkStart + this.pageLinkCount : pageEnd;

        this.linkArray = Array.from(new Array(this.linkEnd - this.linkStart + 1), (x,i) => i + this.linkStart);
		this.cdr.detectChanges();
		
		console.log("#### linkArray", this.linkArray);
		})
		//});
      }
    );
	
  }
  
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
