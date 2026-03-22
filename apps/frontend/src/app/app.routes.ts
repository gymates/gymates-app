import { Route } from '@angular/router';
import { LoginPageComponent } from './features/auth/login/login-page.component';
import { RegisterPageComponent } from './features/auth/register/register-page.component';
import { roleGuard } from './core/auth/role.guard';
import { authGuard } from './core/auth/auth.guard';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { ForbiddenPageComponent } from './features/auth/forbidden/forbidden-page.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardPageComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadChildren: () => import('./features/admin/admin.routes'),
  },
  {
    path: 'forbidden',
    component: ForbiddenPageComponent,
  },
];
