import { Component, OnInit, Input, Inject, PLATFORM_ID, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

//import { default as jQuery } from 'jquery';

import { Observable, of, tap, startWith } from 'rxjs';

import { BoardService } from '../board.service';
import { EnvironmentService } from '../environment.service';

import { Comment } from '../comment';

import { CookieService } from 'ngx-cookie-service';

//import { Http } from '@angular/http';

@Component({
	selector: 'app-user-comments',

	templateUrl: './user-comments.component.html',

	styleUrls: ['./user-comments.component.css'],
	imports: [FormsModule, CommonModule],

	standalone: true

})
export class UserCommentsComponent implements OnInit {

  @Input() boardArticleIdx: number = 0;
  

  //headers: HttpHeaders;

  @Input() locale: string = "ko";
  loginId: string = "";

  lang: string = "";

  //commentList: Comment[] = [];
  commentList: Observable<Comment[]> = of([]);

  userName = "";
  userPassword = "";
  content = "";
  userPasswordPopup = "";

  routerURL: string = "";
  routerArray: string[] = [];

  update1ButtonVisible: { [key: number]: boolean } = {};
  update2ButtonVisible: { [key: number]: boolean } = {};
  
  content1Visible: { [key: number]: boolean } = {};
  content2Visible: { [key: number]: boolean } = {};
  
  layer1Visible: boolean = false;
  
  //content2Text: string[] = [];
  content2Text: { [key: number]: string } = {};
  
  @ViewChild('userNameInput') inputElementUserName!: ElementRef<HTMLInputElement>;
  @ViewChild('userPasswordInput') inputElementUserPassword!: ElementRef<HTMLInputElement>;
  @ViewChild('contentInput') inputElementContent!: ElementRef<HTMLInputElement>;
  
  @ViewChild('userPasswordPopupInput') inputElementUserPasswordPopup!: ElementRef<HTMLInputElement>;
  
  @ViewChild('layer1Div') layer1!: ElementRef<HTMLDivElement>;
  
  //private platformId = inject(PLATFORM_ID);
  //private $: any = null;

  constructor(private route: ActivatedRoute,
    private boardService: BoardService,
    public environmentService: EnvironmentService,
    private cookieService: CookieService,
    //private fbuilder: FormBuilder,
    //private http: Http,
    private router: Router,
	@Inject(PLATFORM_ID) private platformId: Object,
	private http: HttpClient,
	private cdr: ChangeDetectorRef
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
      }
    });
  }

  ngOnInit() {
	
    //if (isPlatformBrowser(this.platformId)) {
      //const jq = await import('jquery');
      //this.$ = jq.default;
    //}
  
    //this.environmentService.getEmptyRequest().subscribe(
      //response => {
        //console.log("빈 요청 4-1", response);
	//console.log("빈 요청 4-2", response.RequestURI);
      //}
    //);

    let lang = this.route.snapshot.paramMap.get('lang') == null ? "" : this.route.snapshot.paramMap.get('lang')!;
    this.lang = lang;
    //console.log("lang 4", lang);

    //this.$('.btn-example').click(function(){
      //let jQueryhref = this.$(this).attr('href');
      //this.layer_popup(jQueryhref);
    //});

    this.getUserCommentList(this.boardArticleIdx);

        //this.form = this.fbuilder.group({
            //name: 'commentInputFrm',
            //description: ''
        //});

	//console.log("comment form", this.form);
    
	if (isPlatformBrowser(this.platformId)) {
	  this.getEnvironmentInfo();
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

      	  if (this.lang == "" || this.lang == null) {
      	    this.locale = response.locale;
			this.cdr.detectChanges();
      	  } else {
      	    this.locale = this.lang;
			this.cdr.detectChanges();
      	  }

      	  this.loginId = response["loginId"];
		  this.cdr.detectChanges();

          console.log("this.loginId", this.loginId);
		  
      	  //alert("this.loginId : " + this.loginId);

      	  //this.csrfToken = response["csrfToken"];
		  //this.cdr.detectChanges();
		  //console.log('browser csrfToken 2 :', response['csrfToken']);
      	  //this.cookieService.set( "referrer", response["referrer"], 0, "/", '.jisblee.me' );
        }
      );
	  
	  //if (isPlatformBrowser(this.platformId)) {
	    //this.environmentService.getEnvironmentInfo(this.lang).subscribe(response => {
		  //console.log('browser csrfToken 1 :', response['csrfToken']);
  	      //this.csrfToken = response['csrfToken'];
		  //this.cdr.detectChanges();
        //});
      //}
	  
  }

/*
  getUserCommentList(boardArticleIdx: number): void {
    this.boardService.getUserCommentList(boardArticleIdx)
      .subscribe(response => {
        this.commentList = response;
		
        this.content2Text = {};
        this.commentList.forEach(item => {
          this.content2Text[item.commentIdx] = item.content;
		  
		  this.update1ButtonVisible[item.commentIdx] = true;
		  this.update2ButtonVisible[item.commentIdx] = false;
		  this.content1Visible[item.commentIdx] = true;
		  this.content2Visible[item.commentIdx] = false;
        });
		
      },
      (err) => {
        //console.log("getUserCommentList error", err);
      },
      () => {
        //console.log("attachmentList", this.attachmentList);
      }
    );
  }
*/

getUserCommentList(boardArticleIdx: number): void {
  this.commentList = this.boardService.getUserCommentList(boardArticleIdx).pipe(
    tap(response => {
      this.content2Text = {};
      //this.update1ButtonVisible = {};
      //this.update2ButtonVisible = {};
      //this.content1Visible = {};
      //this.content2Visible = {};

      (response ?? []).forEach(item => {
        this.content2Text[item.commentIdx] = item.content;
        this.update1ButtonVisible[item.commentIdx] = true;
        this.update2ButtonVisible[item.commentIdx] = false;
        this.content1Visible[item.commentIdx] = true;
        this.content2Visible[item.commentIdx] = false;
      });
    }),
    startWith([])
  );
}


  checkLength(e: KeyboardEvent) {
  	var maxLength = 300;
    var val: any = this.content;
  	if (e.keyCode != 8 && val.length >= maxLength) {  // 8 : 백스페이스키
  		if (this.locale == "ko") {
		    alert("최대 300 자까지 입력 가능합니다.");
		  } else if (this.locale == "en") {
		    alert("Maximum character count is 300.");
		  }
  		e.preventDefault();
  		return false;
  	}
    return true;
  }


  inputComment() {

  	if (this.userName.trim() == "") {
		if (this.locale == "ko") {
  		    alert("이름을 입력해주시기 바랍니다.");
		} else if (this.locale == "en") {
		    alert("Input name.");
		}
  		this.inputElementUserName.nativeElement.focus();
  		return false;
  	}

  	if (this.userPassword.trim() == "") {
		if (this.locale == "ko") {
  		    alert("비밀번호를 입력해주시기 바랍니다.");
		} else if (this.locale == "en") {
		    alert("Input Password.");
		}
  		this.inputElementUserPassword.nativeElement.focus();
  		return false;
  	}

  	if (this.content.trim() == "") {
		if (this.locale == "ko") {
  		    alert("내용을 입력해주시기 바랍니다.");
		} else if (this.locale == "en") {
		    alert("Input Content.");
		}
  		this.inputElementContent.nativeElement.focus();
  		return false;
  	}


	const formObj = {
	  content: this.content,
	  userPassword: this.userPassword,
	  userName: this.userName,
	  boardArticleIdx: this.boardArticleIdx,
	  parentIdx: ''//,
	  //_csrf: this.csrfToken
	};

	const body = new HttpParams()
	  .set('content', formObj.content)
	  .set('userPassword', formObj.userPassword)
	  .set('userName', formObj.userName)
	  .set('boardArticleIdx', String(formObj.boardArticleIdx))
	  //.set('parentIdx', formObj.parentIdx != null ? String(formObj.parentIdx) : "0")
	  .set('parentIdx', "0")
	  //.set('_csrf', formObj._csrf);

	//console.log('csrfToken:', this.csrfToken);
	console.log('userName:', this.userName);
	console.log('content:', this.content);

	this.http.post('https://jisblee.me/inputComment.do', body.toString(), {
	  headers: new HttpHeaders({
		'Content-Type': 'application/x-www-form-urlencoded'
		//'X-CSRF-TOKEN': this.csrfToken
	  }),
	  withCredentials: true
	}).subscribe({
	  next: () => {
		alert(this.locale === 'ko' ? '입력되었습니다.' : 'Inputed.');
		location.reload();
	  },
	  error: (error) => {
		console.log(error);
		alert(this.locale === 'ko' ? '에러가 발생했습니다.' : 'Error Occurred.');
	  }
	});
	
	
    return true;
  }

  serialize(obj: object): string {
    var str: string[] = [];

	  for (const [key, value] of Object.entries(obj)) {
		str.push(
		  encodeURIComponent(key) + "=" + encodeURIComponent(String(value ?? ""))
		);
	  }

    return str.join("&");
  }



  setDefault() {
  	//this.$("input[id^='update1Button_']").show();
  	//this.$("input[id^='update2Button_']").hide();
	//this.update1ButtonVisible = true;
	//this.update2ButtonVisible = false;
  	//this.$("td[id^='content1_']").show();
  	//this.$("td[id^='content2_']").hide();
	//this.content1Visible = true;
	//this.content2Visible = false;
	
	this.commentList.subscribe(res => {
	
	  res.forEach(item => {
	    this.update1ButtonVisible[item.commentIdx] = true;
        this.update2ButtonVisible[item.commentIdx] = false;
        this.content1Visible[item.commentIdx] = true;
        this.content2Visible[item.commentIdx] = false;
      });
	});
	
	//this.commentList.forEach(item => {
	  //this.update1ButtonVisible[item.commentIdx] = true;
	  //this.update2ButtonVisible[item.commentIdx] = false;
	  //this.content1Visible[item.commentIdx] = true;
	  //this.content2Visible[item.commentIdx] = false;
	//});
  }

  toggleUpdateButton(commentIdx: number) {

  	this.setDefault();

  	//this.$("#update1Button_" + commentIdx).hide();
  	//this.$("#update2Button_" + commentIdx).show();
	//this.update1ButtonVisible = false;
	//this.update2ButtonVisible = true;
  	//this.$("#content1_" + commentIdx).hide();
  	//this.$("#content2_" + commentIdx).show();
	//this.content1Visible = false;
	//this.content2Visible = true;
	
	  this.update1ButtonVisible[commentIdx] = false;
	  this.update2ButtonVisible[commentIdx] = true;
	  this.content1Visible[commentIdx] = false;
	  this.content2Visible[commentIdx] = true;
  }

	valueCommentIdx: number | string = "";
	valueAction: 'update' | 'delete' | '' = '';
	valueUserPassword: string = "";

  checkPassword(commentIdx: number | string, action: 'update' | 'delete'): void {

  	this.valueCommentIdx = commentIdx;
  	this.valueAction = action;

  	//this.$("#layer1").show();
	this.layer1Visible = true;

  	//this.$("#userPasswordPopup").focus();
	//this.inputElementUserPasswordPopup.nativeElement.focus();
    setTimeout(() => {
      this.inputElementUserPasswordPopup?.nativeElement?.focus();
    }, 0);
  }

submitPasswordPopup(): void {
  this.valueUserPassword = this.userPasswordPopup as string;

  if (this.valueUserPassword.trim() == "") {
    if (this.locale == "ko") {
      alert("비밀번호를 입력해주시기 바랍니다.");
    } else if (this.locale == "en") {
      alert("Input Password.");
    }
  } else {
    //this.$("#layer1").hide();
	this.layer1Visible = false;

    if (this.valueAction === 'update' || this.valueAction === 'delete') {
      this.submitPassword(this.valueCommentIdx, this.valueAction);
    }
  }
}

  closePasswordPopup() {
  	//this.$("#layer1").hide();
	this.layer1Visible = false;
  }

  submitPassword(commentIdx: number | string, action: 'update' | 'delete'): void {

  	this.setDefault();

  	//var userPassword = prompt("비밀번호를 입력해주시기 바랍니다.");
  	let userPassword = this.valueUserPassword;

  	if (userPassword == null || userPassword == "") {
  		return;
  	}

  	let url = "";
  	let msg = "";
  	let data = null;

  	if (action == "update") {
  		//url = window !== undefined && window.location.hostname == "localhost" ? 'http://localhost:8080/updateComment.do' : "https://jisblee.me/updateComment.do";
		url = 'https://jisblee.me/updateComment.do';
		if (this.locale == "ko") {
  			msg = "수정되었습니다.";
		} else if (this.locale == "en") {
  			msg = "Modified.";
		}
  	} else if (action == "delete") {
  		//url = window !== undefined && window.location.hostname == "localhost" ? 'http://localhost:8080/deleteComment.do' : "https://jisblee.me/deleteComment.do";
		url = 'https://jisblee.me/deleteComment.do';
		if (this.locale == "ko") {
  			msg = "삭제되었습니다.";
		} else if (this.locale == "en") {
			msg = "Deleted.";
		}
  	}

  	//alert(this.$("#content2Text_" + commentIdx).val());
	//return false;

  const url1 = 'https://jisblee.me/checkCommentPassword.do';

  const headers = new HttpHeaders({
    //'X-CSRF-Token': this.csrfToken
  });

  const body = new HttpParams()
    .set('userPassword', userPassword)
    .set('commentIdx', String(commentIdx))
    .set('content', this.content2Text[Number(commentIdx)] ?? '')
    .set('action', action);

  this.http.post<any>(url1, body.toString(), {
    headers: headers.set('Content-Type', 'application/x-www-form-urlencoded')
  }).subscribe({
    next: (data) => {
      if (data.checkCount == 0) {
        if (this.locale === 'ko') {
          alert('비밀번호가 일치하지 않습니다.\n다시 입력해주시기 바랍니다.');
        } else if (this.locale === 'en') {
          alert('Password does not match.');
        }
        return;
      }

      alert(msg);
      location.reload();
    },
    error: (error) => {
      console.log(error);

      if (this.locale === 'ko') {
        alert('에러가 발생했습니다.');
      } else if (this.locale === 'en') {
        alert('Error occurred.');
      }
    }
  });
  
  }



  layer_popup(): void {

      if (!isPlatformBrowser(this.platformId)) return;
	  
      //var el = this.$("#layer1");        //레이어의 id를 el 변수에 저장
	  const el = this.layer1.nativeElement;
      //var isDim = el.prev().hasClass('dimBg');   //dimmed 레이어를 감지하기 위한 boolean 변수

      //isDim ? this.$('.dim-layer').fadeIn() : el.fadeIn();

      //this.$("#layer1").show();
      this.layer1Visible = true;
	  
      //alert("1");

      //var elWidth = ~~(el.outerWidth())!,
          //elHeight = ~~(el.outerHeight())!,
          //docWidth = this.$(document).width()!,
          //docHeight = this.$(document).height()!;

      const elWidth = el.offsetWidth;
      const elHeight = el.offsetHeight;

      const docWidth = document.documentElement.clientWidth;
      const docHeight = document.documentElement.clientHeight;

		/*
      // 화면의 중앙에 레이어를 띄운다.
      if (elHeight < docHeight || elWidth < docWidth) {
          el.css({
              marginTop: -elHeight /2,
              marginLeft: -elWidth/2
          })
      } else {
          el.css({top: 0, left: 0});
      }

      el.find('a.btn-layerClose').click(() => {
          //isDim ? this.$('.dim-layer').fadeOut() : el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
          return false;
      });

      this.$('.layer .dimBg').click(() => {
          this.$('.dim-layer').fadeOut();
          return false;
      });
	  */


	  if (elHeight < docHeight || elWidth < docWidth) {
		el.style.marginTop = `-${elHeight / 2}px`;
		el.style.marginLeft = `-${elWidth / 2}px`;
	  } else {
		el.style.top = '0';
		el.style.left = '0';
	  }

	  // 닫기 버튼
	  const closeBtn = el.querySelector('a.btn-layerClose');
	  closeBtn?.addEventListener('click', (e) => {
		e.preventDefault();
		el.style.display = 'none';
	  });

	  // dim 배경 클릭
	  const dimBg = document.querySelector('.layer .dimBg');
	  dimBg?.addEventListener('click', () => {
		const dimLayer = document.querySelector('.dim-layer') as HTMLElement;
		if (dimLayer) {
		  dimLayer.style.display = 'none';
		}
	  });
	  
  }

}
