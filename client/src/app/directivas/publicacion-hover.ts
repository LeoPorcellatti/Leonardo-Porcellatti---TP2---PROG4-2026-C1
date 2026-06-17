import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appPublicacionHover]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class PublicacionHover {
  private elemento = inject(ElementRef);

  color = input('#3cc776');
  colorNormal = input('#0a1e1499');

  onMouseEnter() {
    this.elemento.nativeElement.style.backgroundColor = this.color();
  }

  onMouseLeave() {
    this.elemento.nativeElement.style.backgroundColor = this.colorNormal();
  }
}
