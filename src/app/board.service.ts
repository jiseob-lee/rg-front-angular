import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { REQUEST } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Article } from './article';
import { MessageService } from './message.service';
import { BoardContent } from './boardContent';
import { Attachment } from './attachment';
import { Comment } from './comment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiBaseUrl = this.resolveApiBaseUrl();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private resolveApiBaseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      if (window.location.hostname === 'localhost') {
        return 'http://localhost:8080';
      }
      return 'https://jisblee.me';
    }

    // SSR
    //return 'http://127.0.0.1:8080';
	return 'https://jisblee.me';
  }

  private buildUrl(path: string): string {
  const url = `${this.apiBaseUrl}${path}`;
  console.log('[BoardService] url =', url);
  return url;
  }

  getBoardList(boardNo: number, pageNo: number, lang: string): Observable<Article[]> {
    pageNo = pageNo > 0 ? pageNo : 1;

    const listLimit = 10;
    const listOffset = listLimit * (pageNo - 1);

    let url = `${this.buildUrl('/getBoardList.do')}?boardIdx=${boardNo}&listOffset=${listOffset}&listLimit=${listLimit}`;

    if (lang === 'ko' || lang === 'en') {
      url += `&lang=${lang}`;
    }

    return this.http.get<Article[]>(url);
  }

  getBoardListCount(boardNo: number): Observable<number> {
    const url = `${this.buildUrl('/getBoardListCount.do')}?boardIdx=${boardNo}`;
    return this.http.get<number>(url, { transferCache: false });
  }

  getBoardContent(boardArticleIdx: number, pathname: string, referrer: string, locale: string): Observable<BoardContent> {
    if (!(locale == null || locale === '' || locale === 'ko' || locale === 'en')) {
      locale = '';
    }

    let localeString = '';
    if (locale) {
      localeString = '&lang=' + locale;
    }

    const url =
      `${this.buildUrl('/getBoardContent.do')}?boardArticleIdx=${boardArticleIdx}&pathname=${pathname}&referrer=${referrer}${localeString}`;

    return this.http.get<BoardContent>(url, { transferCache: false });
  }

  getAttachmentList(boardNo: number, boardArticleIdx: number): Observable<Attachment[]> {
    const url = `${this.buildUrl('/getAttachmentList.do')}?boardIdx=${boardNo}&boardArticleIdx=${boardArticleIdx}`;
    return this.http.get<Attachment[]>(url, { transferCache: false });
  }

  getUserCommentList(boardArticleIdx: number): Observable<Comment[]> {
    const url = `${this.buildUrl('/getCommentList.do')}?boardArticleIdx=${boardArticleIdx}`;
    return this.http.get<Comment[]>(url, { transferCache: false });
  }

  inputUserComment(comment: string, options: Object): Observable<Object> {
    return this.http.post<Object>(this.buildUrl('/inputComment.do'), comment, options).pipe(
      tap(resp => {
        console.log('response 2', resp);
      })
    );
  }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }
}