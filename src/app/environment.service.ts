import { Injectable, Inject, PLATFORM_ID, Optional, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Environment } from './environment';
import { Board } from './board';

import { CookieService } from 'ngx-cookie-service';

//import { ConnectionBackend, Http, Request, RequestOptions, RequestOptionsArgs, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private environmentInfoURL = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEnvironment.do' : "https://jisblee.me/getEnvironment.do";
  private manageBoardListURL = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getManageBoardList.do?openYn=1' : "https://jisblee.me/getManageBoardList.do?openYn=1";

  //private environmentInfoURL = 'https://jisblee.me/getEnvironment.do';
  //private manageBoardListURL = 'https://jisblee.me/getManageBoardList.do?openYn=1';

  public environmentInfo: Environment = {} as Environment;
  public manageBoardList: Board[] = [];

  constructor(
    private http: HttpClient,
    //private http2: Http,
    private cookieService: CookieService
    ) { }

  /* 로그인 정보와 로케일(언어) 정보를 구한다. */
  getEnvironmentInfo(lang: string): Observable<Environment> {

    if (!(lang == null || lang == "" || lang == "ko" || lang == "en")) {
        lang = "";
    }
    
    let langPath = "";
    if (lang != null && lang != "") {
      langPath = lang + "/";
    }

    let url = this.environmentInfoURL + (lang ? "?lang=" + lang : "");
    //let url = this.environmentInfoURL;
    //let url = `https://jisblee.me/${langPath}/getEnvironment.do`;
    //let url = window !== undefined && window.location.hostname == "localhost" ? `http://localhost:8080/getEnvironment.do` : `https://jisblee.me/getEnvironment.do`;
    //let url = `https://jisblee.me/getEnvironment.do`;

    console.log("EnvironmentInfo 1", url);

    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')
			             .set("Content-Type", "application/x-www-form-urlencoded")
                                     .set('Cache-Control', 'no-cache, no-store, must-revalidate')
                                     .set('Pragma', 'no-cache')
                                     .set('Expires', '0')
				     .set('withCredentials', 'true');
    let options = { headers: headers };

    return this.http.get<Environment>(url, { withCredentials: true }).pipe(
      tap({
        next: (res) => console.log('Environment GET success:', res),
        error: (err) => console.error('Environment GET error:', err)
      }),
      catchError((err) => {
        console.error('Environment GET error:', err);
        return throwError(() => err);
      })
    );
  }

  /* 공개 게시판 목록을 구한다. */
  getManageBoardList(lang: string): Observable<Board[]> {

    if (!(lang == null || lang == "" || lang == "ko" || lang == "en")) {
        lang = "";
    }
    
    let url = this.manageBoardListURL + (lang ? "&lang=" + lang : "");
    //let url = this.manageBoardListURL;

    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')
			             .set("Content-Type", "application/x-www-form-urlencoded")
                                     .set('Cache-Control', 'no-cache, no-store, must-revalidate')
                                     .set('Pragma', 'no-cache')
                                     .set('Expires', '0')
				     .set('withCredentials', 'true');
    let options = { headers: headers };

    //let response1: Observable<Response> = this.http2.get(url);
    //console.log("Http 응답 1", response1);

    //this.http2.get(url).subscribe(
      //response2 => {
        //console.log("Http 응답 2", response2);
      //}
    //);

    return this.http.get<Board[]>(url, { withCredentials: true });
  }

  /* 빈 요청을 보낸다. */
  getEmptyRequest(): Observable<any> {
    let url = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEmptyRequest.do' : "https://jisblee.me/getEmptyRequest.do";
    //let url = 'https://jisblee.me/getEmptyRequest.do';
    return this.http.get(url);
  }

  /* 빈 요청을 보낸다. */
  getEmptyRequest1(): Observable<any> {
    let url = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEmptyRequest1.do' : "https://jisblee.me/getEmptyRequest1.do";
    //let url = 'https://jisblee.me/getEmptyRequest1.do';
    return this.http.get(url);
  }

  /* 빈 요청을 보낸다. */
  getEmptyRequest2(): Observable<any> {
    let url = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEmptyRequest2.do' : "https://jisblee.me/getEmptyRequest2.do";
    //let url = 'https://jisblee.me/getEmptyRequest2.do';
    return this.http.get(url);
  }

  /* 빈 요청을 보낸다. */
  getEmptyRequest3(): Observable<any> {
    let url = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEmptyRequest3.do' : "https://jisblee.me/getEmptyRequest3.do";
    //let url = 'https://jisblee.me/getEmptyRequest3.do';
    return this.http.get(url);
  }

  /* 빈 요청을 보낸다. */
  getEmptyRequest4(): Observable<any> {
    let url = typeof window !== "undefined" && window.location.hostname == "localhost" ? 'http://localhost:8080/getEmptyRequest4.do' : "https://jisblee.me/getEmptyRequest4.do";
    //let url = 'https://jisblee.me/getEmptyRequest4.do';
    return this.http.get(url);
  }


}
