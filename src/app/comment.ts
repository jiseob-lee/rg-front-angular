export class Comment {
  commentIdx: number = 0;
  content: string = "";
  dateCreated: string = "";
  dateModified: string = "";
  userPassword: string = "";
  userName: string = "";
  boardArticleIdx: number = 0;
  parentIdx: number = 0;
  level: number = 0;
  action: string = "";
  locale: string = "";
  _csrf: string = "";

  constructor (
    content: string,
    userPassword: string,
    userName: string,
    boardArticleIdx: number,
    parentIdx: number,
    _csrf: string
  ) {
    this.content = content;
    this.userPassword = userPassword;
    this.userName = userName;
    this.boardArticleIdx = boardArticleIdx;
    this.parentIdx = parentIdx;
    this._csrf = _csrf;
  }
}
