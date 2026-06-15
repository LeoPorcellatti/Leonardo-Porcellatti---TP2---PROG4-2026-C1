import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const usuarioEsAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (usuario.perfil !== 'administrador') {
    router.navigateByUrl('/publicaciones');
    return false;
  }

  return true;
};
