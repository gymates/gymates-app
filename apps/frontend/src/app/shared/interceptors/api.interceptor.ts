import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../tokens';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
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

  return next(apiReq);
};
