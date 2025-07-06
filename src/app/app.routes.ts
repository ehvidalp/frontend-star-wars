import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/pages/home/home').then(m => m.Home),
            },
            {
                path: 'planets',
                loadChildren: () => import('./features/planets/planets.route'),
            }
        ]   
    }
];
