import { Routes } from '@angular/router';

import { TagsComponent } from '@upupa/tags';

import { DataFormComponent, DataListComponent } from '@upupa/cp'
import { AuthGuard } from '@upupa/auth';
import AccountLayoutComponent from './layouts/account-layout/account-layout.component';
import AdminLayoutComponent from './layouts/admin-layout/admin-layout.component';
export const appRoutes: Routes = [
    { path: '', redirectTo: 'en/admin', pathMatch: 'full' },
    {
        path: ':lang',
        children: [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },
            {
                path: 'admin',
                component: AdminLayoutComponent,
                canActivate: [AuthGuard],
                children: [
                    { path: 'list/:collection', component: DataListComponent },
                    { path: 'create/:collection', component: DataFormComponent },
                    { path: 'edit/:collection/:id', component: DataFormComponent },
                    { path: 'tags', component: TagsComponent },
                ]
            },
        ]
    },
    { path: ':lang/account', component: AccountLayoutComponent, loadChildren: () => import('./accounts.module').then(m => m.AccountsModule) },
    { path: '**', redirectTo: '/en/admin' }
];
