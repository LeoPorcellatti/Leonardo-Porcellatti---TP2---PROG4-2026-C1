import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noEstaLogueadoGuard } from './no-esta-logueado-guard';

describe('noEstaLogueadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => noEstaLogueadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
