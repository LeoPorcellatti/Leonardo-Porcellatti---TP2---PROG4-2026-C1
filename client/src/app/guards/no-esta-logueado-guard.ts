import { CanActivateFn } from '@angular/router';

export const noEstaLogueadoGuard: CanActivateFn = (route, state) => {
  return true;
};
