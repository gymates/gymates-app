import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const roleGuard =
  (requiredRole: string): CanActivateFn =>
  () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.userRole() === requiredRole) return true;
    return router.createUrlTree(['/forbidden']);
  };
