import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  if (!password) {
    return null;
  }

  const minimoCaracteres = password.length >= 8;
  const tieneMayuscula = password.match(/[A-Z]/);
  const tieneNumero = password.match(/[[0-9]/);

  if (!minimoCaracteres || !tieneMayuscula || !tieneNumero) {
    return { passwordInvalida: true };
  }

  return null;
}
