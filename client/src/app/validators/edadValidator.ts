import { AbstractControl, ValidationErrors } from '@angular/forms';

export function edadValidator(control: AbstractControl): ValidationErrors | null {
  const fechaIngresada = control.value;

  if (!fechaIngresada) return null;

  const fechaDeNacimiento = new Date(fechaIngresada);
  const fechaActual = new Date();

  if (fechaDeNacimiento > fechaActual) {
    return { edadFutura: true };
  }

  const edadMinima = new Date(
    fechaActual.getFullYear() - 10,
    fechaActual.getMonth(),
    fechaActual.getDate(),
  );

  const edadMaxima = new Date(
    fechaActual.getFullYear() - 99,
    fechaActual.getMonth(),
    fechaActual.getDate(),
  );

  if (fechaDeNacimiento > edadMinima) {
    return { edadMinimaRegistro: true };
  }

  if (fechaDeNacimiento < edadMaxima) {
    return { edadMaximaRegistro: true };
  }

  return null;
}
