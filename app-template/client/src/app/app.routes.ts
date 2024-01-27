import { Routes } from '@angular/router';

import { AuthGuard } from '@upupa/auth';
import AccountLayoutComponent from './layouts/account-layout/account-layout.component';
import AdminLayoutComponent from './layouts/admin-layout/admin-layout.component';
import { cpRoutes } from '@upupa/cp';
export const appRoutes: Routes = [
    { path: '', redirectTo: '/en', pathMatch: 'full' },
    {
        path: ':lang',
        children: [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            {
                path: 'admin',
                canActivate: [AuthGuard],
                component: AdminLayoutComponent,
                children: [
                    ...cpRoutes,
                ]
            },
        ]
    },
    { path: ':lang/account', component: AccountLayoutComponent, loadChildren: () => import('./accounts.module').then(m => m.AccountsModule) },
    { path: '**', redirectTo: '/en' }
];