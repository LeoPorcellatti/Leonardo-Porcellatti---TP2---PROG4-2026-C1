import { AbstractControl, ValidationErrors } from '@angular/forms';

export function edadMinimaValidator(control: AbstractControl): ValidationErrors | null {
  const fechaIngresada = control.value;

  if (!fechaIngresada) return null;

  const fechaDeNacimiento = new Date(fechaIngresada);
  const fechaActual = new Date();

  const edadMinima = new Date(
    fechaActual.getFullYear() - 10,
    fechaActual.getMonth(),
    fechaActual.getDate(),
  );

  if (fechaDeNacimiento >= edadMinima) {
    return { edadHabilitada: true };
  }

  return null;
}
