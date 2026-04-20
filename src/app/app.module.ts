import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withFetch }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { UserCommentsComponent } from './user-comments/user-comments.component';
import { MessagesComponent } from './messages/messages.component';
import { EnvironmentService } from './environment.service';

import { CookieService } from 'ngx-cookie-service';
//import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

//import { CookieServiceService } from './cookie-service.service';

@NgModule({ declarations: [
        MessagesComponent
    ],
    //bootstrap: [AppComponent], 
	imports: [
        AppRoutingModule,
        //HttpModule,
        AppComponent,
        UserCommentsComponent,
		BoardListComponent,
		BoardViewComponent,
		FormsModule], 
	providers: [
        CookieService
        //CookieServiceService,
        //{ provide: 'req', useValue: null }
        ,
        provideHttpClient(withFetch())
    ] })
export class AppModule { }
