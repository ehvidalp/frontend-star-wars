import { Routes } from '@angular/router';

const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
];

export default [
    {
        path: '',
        children: HOME_ROUTES
    }
];