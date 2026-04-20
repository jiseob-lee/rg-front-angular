export class Board {
  boardIdx: number;
  boardName: string;
  dateCreated: string;
  userIdCreated: string;
  userNameCreated: string;
  dateModified: string;
  userIdModified: string;
  userNameModified: string;
  articleCount: number;
  attachmentCount: number;

  
  constructor (
    boardIdx: number,
    boardName: string,
    dateCreated: string,
    userIdCreated: string,
    userNameCreated: string,
    dateModified: string,
    userIdModified: string,
    userNameModified: string,
    articleCount: number,
    attachmentCount: number
  ) {
    this.boardIdx = boardIdx;
    this.boardName = boardName;
    this.dateCreated = dateCreated;
    this.userIdCreated = userIdCreated;
    this.userNameCreated = userNameCreated;
    this.dateModified = dateModified;
    this.userIdModified = userIdModified;
    this.userNameModified = userNameModified;
    this.articleCount = articleCount;
    this.attachmentCount = attachmentCount;
  }
}
