import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfirmModalService } from '../services/confirm-modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const toast = inject(ToastService); // Removed

  if (authService.isLoggedIn() && authService.isSuperAdmin()) {
    return true;
  }

  // Show modal if logged in but not authorized
  // Using Modal instead of Toast to avoid loops/ensure user action
  if (authService.isLoggedIn()) {
    const modal = inject(ConfirmModalService);
    modal.show({
      title: 'Access Denied',
      message: 'You do not have permission to access this area.',
      confirmText: 'OK',
      type: 'danger',
      onConfirm: () => {
        authService.logout();
        router.navigate(['/login']);
      },
      // No cancel
    });
    return false;
  }

  router.navigate(['/login']);
  return false;
};
