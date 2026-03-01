import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './shared/interceptors/api.interceptor';
import { API_URL } from './shared/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'http://localhost:8080/api' },
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptors([apiInterceptor])),
    provideAnimations(),
  ],
};
