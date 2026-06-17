import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appImagenAmpliada]',
  host: {
    '(click)': 'abrirImagen($event)',
  },
})
export class ImagenAmpliada {
  private elemento = inject(ElementRef<HTMLImageElement>);

  imagen = output<string>();

  abrirImagen(event: MouseEvent) {
    event.stopPropagation();

    const src = this.elemento.nativeElement.src;

    this.imagen.emit(src);
  }
}
