import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verMas',
})
export class VerMasPipe implements PipeTransform {
  transform(texto: string, limite: number = 100): string {
    if (!texto) {
      return '';
    }

    if (texto.length <= limite) {
      return texto;
    }

    return texto.slice(0, limite) + '...Ver más';
  }
}
