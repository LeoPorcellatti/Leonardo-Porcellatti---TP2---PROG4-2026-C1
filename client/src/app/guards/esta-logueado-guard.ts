import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const estaLogueadoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/publicaciones');
    return false;
  }

  return true;
};
