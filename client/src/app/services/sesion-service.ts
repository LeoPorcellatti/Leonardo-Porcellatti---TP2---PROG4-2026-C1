import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  sesionIniciada = signal(false);
  sesionCerrada = signal(false);
}
