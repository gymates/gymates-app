import { Route } from '@angular/router';
import { LoginComponent } from './features/auth/login/login-page.component';
import { RegisterComponent } from './features/auth/register/register-page.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
