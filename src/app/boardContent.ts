import { SafeHtml } from '@angular/platform-browser';

export class BoardContent {
  boardArticleIdx: number = 0;
  boardIdx: number = 0;
  boardName: string = "";
  subject: string = "";
  content: string = "";
  contentSafe: SafeHtml = "";
  subjectEng: string = "";
  contentEng: string = "";
  contentEngSafe: SafeHtml = "";
  hitCount: number = 0;
  dateCreated: string = "";
  userIdCreated: string = "";
  userNameCreated: string = "";
  userNameCreatedEng: string = "";
  dateModified: string = "";
  userIdModified: string = "";
  userNameModified: string = "";
  openYn: string = "";
  csrfToken: string = "";

  /*
  constructor (
    boardArticleIdx: number,
    boardIdx: number,
    boardName: string,
    subject: string,
    content: string,
    subjectEng: string,
    contentEng: string,
    hitCount: number,
    dateCreated: string,
    userIdCreated: string,
    userNameCreated: string,
    dateModified: string,
    userIdModified: string,
    userNameModified: string,
    openYn: string,
    csrfToken: string
  ) {
    this.boardArticleIdx = boardArticleIdx;
    this.boardIdx = boardIdx;
    this.boardName = boardName;
    this.subject = subject;
    this.content = content;
    this.subjectEng = subjectEng;
    this.contentEng = contentEng;
    this.hitCount = hitCount;
    this.dateCreated = dateCreated;
    this.userIdCreated = userIdCreated;
    this.userNameCreated = userNameCreated;
    this.dateModified = dateModified;
    this.userIdModified = userIdModified;
    this.userNameModified = userNameModified;
    this.openYn = openYn;
    this.csrfToken = csrfToken;
  }
  */
}
