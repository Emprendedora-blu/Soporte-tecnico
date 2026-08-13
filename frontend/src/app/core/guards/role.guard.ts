import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/auth.model';

export const roleGuard = (...allowedRoles: Rol[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authService.hasRole(...allowedRoles)) {
      return true;
    }

    return router.createUrlTree([authService.homeRouteForCurrentUser()]);
  };
};