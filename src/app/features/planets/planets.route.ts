import { Routes } from '@angular/router';
const PLANETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/planets-list/planets-list').then(m => m.PlanetsList),
  },
  {
    path: ':planetId',
    loadComponent: () => import('./pages/planet-details/planet-details').then(m => m.PlanetDetails),
    data: { 
      prerender: false  // Disable prerendering for dynamic routes
    }
  },
];
export default PLANETS_ROUTES;