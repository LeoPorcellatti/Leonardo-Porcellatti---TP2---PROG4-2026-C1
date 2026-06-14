import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, map, of } from 'rxjs';

export const noEstaLogueadoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');
  const apiUrl = environment.apiUrl;

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }
  return http
    .post(
      `${apiUrl}/autenticacion/autorizar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .pipe(
      map(() => true),
      catchError(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        router.navigateByUrl('/login');
        return of(false);
      }),
    );
};
