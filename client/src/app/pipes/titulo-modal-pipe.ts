import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tituloModal',
  standalone: true,
})
export class TituloModalPipe implements PipeTransform {
  transform(tipo: string): string {
    switch (tipo) {
      case 'listadoUsuarios':
        return 'Listado de Usuarios';
      case 'crearUsuario':
        return 'Crear Usuario';

      case 'habilitarDeshabilitarUsuario':
        return 'Habilitar / Deshabilitar usuario';

      default:
        return 'Modal';
    }
  }
}
