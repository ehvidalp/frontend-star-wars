import { Routes } from '@angular/router';

const PLANETS_ROUTES: Routes = [
  {
    path: ':planetId',
    loadComponent: () => import('./pages/planet-details/planet-details').then(m => m.PlanetDetails),
  },
];

export default [
    {
        path: '',
        children: PLANETS_ROUTES
    }
];