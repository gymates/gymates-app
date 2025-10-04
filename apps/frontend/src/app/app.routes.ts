import { Route } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  // Future: { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) }
];
