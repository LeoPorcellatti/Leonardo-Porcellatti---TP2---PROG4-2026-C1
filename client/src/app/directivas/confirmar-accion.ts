import { Directive, EventEmitter, input, output } from '@angular/core';

@Directive({
  selector: '[appConfirmarAccion]',
  host: {
    '(click)': 'confirmar()',
  },
})
export class ConfirmarAccion {
  mensaje = input('¿Estas seguro?');

  accionConfirmada = output<string>();

  confirmar() {
    this.accionConfirmada.emit(this.mensaje());
  }
}
