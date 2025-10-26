import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStoreService } from '../services';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  // Redirect to login page with return URL
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard to redirect authenticated users away from auth pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  // Redirect to home if already authenticated
  return router.createUrlTree(['/']);
};

/**
 * Guard to protect admin-only routes
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  if (authStore.isAuthenticated() && authStore.isAdmin()) {
    return true;
  }

  // Redirect to home if not admin
  return router.createUrlTree(['/']);
};
