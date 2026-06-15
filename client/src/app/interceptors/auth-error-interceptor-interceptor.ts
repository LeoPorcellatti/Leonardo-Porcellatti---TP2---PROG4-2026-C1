import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SesionService } from '../services/sesion-service';

export const authErrorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sesionService = inject(SesionService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        sesionService.sesionCerrada.set(true);

        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    }),
  );
};
