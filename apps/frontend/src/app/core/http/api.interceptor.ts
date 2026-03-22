import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../../shared/tokens';
import { AuthStore } from '../auth/auth.store';
import { Router } from '@angular/router';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  const isAbsolute = /^https?:\/\//i.test(req.url);

  if (isAbsolute) {
    return next(req);
  }

  const baseUrl = inject(API_URL);
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = req.url.replace(/^\/+/, '');

  const apiReq = req.clone({
    url: `${normalizedBase}/${normalizedPath}`,
  });

  // Dołącz token jeśli istnieje
  const finalReq = token ? apiReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : apiReq;

  return next(finalReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authStore.clearToken();
        inject(Router).navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
