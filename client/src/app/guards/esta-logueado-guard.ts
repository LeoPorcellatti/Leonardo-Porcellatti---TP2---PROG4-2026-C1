import { CanActivateFn } from '@angular/router';

export const estaLogueadoGuard: CanActivateFn = (route, state) => {
  return true;
};
