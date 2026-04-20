import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, withLatestFrom, filter, startWith } from 'rxjs/operators';

import { EnvironmentService } from './environment.service';
import { Board } from './board';

import { CookieService } from 'ngx-cookie-service';

@Component({

	selector: 'app-root',

	templateUrl: './app.component.html',

	styleUrls: ['./app.component.css'],
	imports: [FormsModule, RouterModule, CommonModule],
	standalone: true

})
export class AppComponent implements OnInit {

  title = '이지섭 홈페이지';

  locale: string = "ko";
  loginId: string | null = null;

  lang: string = "ko";

  //manageBoardList: Board[] = [];
  //boardListReady = false;
  
  language: string = "ko";

  routerURL: string = "";
  routerArray: string[] = [];

  cookiePath: string = "/ko";

  csrfToken: string = "";

  boardNo: number = 0;

  manageBoardList$: Observable<Board[]> = new Observable<Board[]>();
  
  constructor(
    private environmentService: EnvironmentService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
	private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.environmentService.getEmptyRequest().subscribe(
      response => {
        //console.log("빈 요청 1-1", response);
	//console.log("빈 요청 1-2", response.RequestURI);
      }
    );

    console.log("router.url 1", this.router.url);

	  this.syncRouteState();
	  this.getEnvironmentInfo();
	  this.getManageBoardList();

	  this.router.events.pipe(
		filter(e => e instanceof NavigationEnd)
	  ).subscribe(() => {
		  this.syncRouteState();
		  this.getEnvironmentInfo();
		  this.getManageBoardList();
	  });
	/*
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      withLatestFrom(this.route.paramMap, this.route.queryParamMap)
    ).subscribe(([e, params, queryParams]) => {
        // no changes after this point

      	//console.log("router.url 2", this.router.url);

      	this.routerURL = this.router.url;

        var routerArray = this.routerURL.split("/");
        routerArray.splice(0, 1);
	      this.routerArray = routerArray;

        this.boardNo = Number(this.routerArray[2]);

        //console.log("boardNo", this.boardNo);

      	//console.log("route params", params);
      	//console.log("route queryParams", queryParams);

        if (this.routerArray[this.routerArray.length - 1] == "ko" || this.routerArray[this.routerArray.length - 1] == "en") {
      	    this.lang = this.routerArray[this.routerArray.length - 1];
      	    this.cookiePath = "/" + this.lang;
      	} else if (this.cookieService.get("lang") != null && this.cookieService.get("lang") != "") {
          this.cookiePath = "/" + this.cookieService.get("lang");
      	  if (this.lang == "" || this.lang == null) {
      	    this.lang = this.cookieService.get("lang");
      	  }
        }

        console.log("lang 1-1", this.lang);

        this.getEnvironmentInfo();
        this.getManageBoardList();
    });
	*/
  }

private syncRouteState(): void {
  this.routerURL = this.router.url;

  const routerArray = this.routerURL.split('/');
  routerArray.splice(0, 1);
  this.routerArray = routerArray;

  this.boardNo = Number(this.routerArray[2] ?? 0);

  const last = this.routerArray[this.routerArray.length - 1];

  if (last === 'ko' || last === 'en') {
    this.lang = last;
    this.cookiePath = '/' + this.lang;
  } else {
    const cookieLang = this.cookieService.get('lang');
    if (cookieLang) {
      this.cookiePath = '/' + cookieLang;
      if (!this.lang) {
        this.lang = cookieLang;
      }
    }
  }
}

  getEnvironmentInfo() {
    this.environmentService.getEnvironmentInfo(this.lang)
      .subscribe(response => {
          //console.log("환경 정보 1", response);

      	  //this.locale = response["locale"];

      	  //console.log("lang 1-2", this.lang);
      	  //console.log("locale 1-1", response.locale);
          //console.log("locale 1-2", response["locale"]);

      	  //if (this.lang == "" || this.lang == null) {
      	    //this.locale = response.locale;
      	  //} else {
      	    //this.locale = this.lang;
      	  //}
		  
		  this.locale = this.lang || response?.locale || 'ko';
		  
		  this.language = this.locale;

      	  this.loginId = response?.loginId ?? null;

          console.log("this.loginId", this.loginId);
      	  //alert("this.loginId : " + this.loginId);

      	  this.csrfToken = response?.csrfToken ?? '';
      	  //this.cookieService.set( "referrer", response["referrer"], 0, "/", '.jisblee.me' );
		  
		  this.cdr.detectChanges();
        }
      );
  }

  /*
  getManageBoardList() {
    this.environmentService.getManageBoardList(this.lang)
      .subscribe(response => {
          //console.log("ManageBoardList 1", response);
          this.manageBoardList = response;
        },
	() => {},
	() => {
	  for (var i=0; i < this.manageBoardList.length; i++) {
	    if (this.manageBoardList[i].articleCount == 0) {
	      this.manageBoardList.splice(i, 1);
	      i--;
	    }
	  }
	}
      );
  }
  */

  getManageBoardList(): void {
	  
    this.manageBoardList$ = this.environmentService.getManageBoardList(this.lang).pipe(
      map(response => (response ?? []).filter(item => item.articleCount !== 0)),
      startWith([])
    );
  }
  
  trackBoard(_index: number, item: Board): number {
    return item.boardIdx;
  }

  ngOnDestroy() {
    //this.environmentService.manageBoardList = this.manageBoardList;
  }

  changeLanguage(): void {

    console.log("language", this.language);

    this.cookieService.set( "lang", this.language, 0, "/", '.jisblee.me' );

    let path = "";

    for (var i=0; i < this.routerArray.length; i++) {
      if (this.routerArray[i] != "ko" && this.routerArray[i] != "en") {
	path += "/" + this.routerArray[i];
      }
    }

    path = path + '/' + this.language;

    location.href = path;
  }
}
