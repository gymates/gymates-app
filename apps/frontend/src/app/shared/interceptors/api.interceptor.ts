import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../tokens';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_URL);

  const apiReq = req.clone({
    url: `${baseUrl}/${req.url}`,
  });

  return next(apiReq);
};
