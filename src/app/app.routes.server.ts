import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'planets/:planetId',
    renderMode: RenderMode.Server  // Use server-side rendering for dynamic routes
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender  // Prerender all other routes
  }
];
