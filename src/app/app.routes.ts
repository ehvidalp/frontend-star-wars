import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadChildren: () => import('./features/home/home.routes'),
            }
        ]   
    }
];
