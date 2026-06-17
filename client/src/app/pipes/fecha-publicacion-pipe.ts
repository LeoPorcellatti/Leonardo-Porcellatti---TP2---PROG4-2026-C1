import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaPublicacion',
})
export class FechaPublicacionPipe implements PipeTransform {
  transform(fechaPublicacion: string): string {
    const fecha = new Date(fechaPublicacion);

    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida';
    }

    const ahora = new Date();

    const diferenciaFecha = ahora.getTime() - fecha.getTime();

    const minutos = Math.floor(diferenciaFecha / (1000 * 60));
    const horas = Math.floor(diferenciaFecha / (1000 * 60 * 60));
    const dias = Math.floor(diferenciaFecha / (1000 * 60 * 60 * 24));

    if (minutos < 1) {
      return 'Ahora...';
    }

    if (minutos < 60) {
      return minutos === 1 ? 'Hace 1 minuto' : `Hace ${minutos} minutos...`;
    }

    if (horas < 24) {
      return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas...`;
    }

    if (dias === 1) {
      return 'Hace 1 día...';
    }

    if (dias < 7) {
      return `Hace ${dias} días...`;
    }

    if (dias < 30) {
      const semanas = Math.floor(dias / 7);

      return semanas === 1 ? 'Hace 1 semana...' : `Hace ${semanas} semanas...`;
    }

    if (dias < 365) {
      const meses = Math.floor(dias / 30);

      return meses === 1 ? 'Hace 1 mes...' : `Hace ${meses} meses...`;
    }

    const anos = Math.floor(dias / 365);

    return anos === 1 ? 'Hace 1 año...' : `Hace ${anos} años...`;
  }
}
