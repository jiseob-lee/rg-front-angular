import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },

  { path: 'board/list/:boardNo/:pageNo', renderMode: RenderMode.Server },
  { path: 'board/list/:boardNo/:pageNo/:lang', renderMode: RenderMode.Server },

  { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx', renderMode: RenderMode.Server },
  { path: 'board/view/:boardNo/:pageNo/:boardArticleIdx/:lang', renderMode: RenderMode.Server },

  { path: '**', renderMode: RenderMode.Server },
];