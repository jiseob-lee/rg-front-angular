import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardListComponent } from './board-list/board-list.component';
import { BoardViewComponent } from './board-view/board-view.component';
import { FirstPageComponent } from './first-page/first-page.component';

export const routes: Routes = [
  //{ path: '', redirectTo: 'board/list/0/1', pathMatch: 'full' },
  { path: '', component: FirstPageComponent, pathMatch: 'full' },
  { path: 'board/list/:boardNo/:pageNo', component: BoardListComponent },
  { path: 'board/list/:boardNo/:pageNo/:lang', component: BoardListComponent },
  { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx', component: BoardViewComponent },
  { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx/:lang', component: BoardViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
