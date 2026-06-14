import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { SesionService } from './services/sesion-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  sesionService = inject(SesionService);
  apiUrl = environment.apiUrl;

  mostrarModal = false;
  segundosRestantes = signal(2 * 60);
  intervalo!: ReturnType<typeof setInterval>;
  tokenExiste = signal(!!localStorage.getItem('token'));

  tiempoFormateado = computed(() => {
    const s = this.segundosRestantes();
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const seg = (s % 60).toString().padStart(2, '0');
    return `${m}:${seg}`;
  });

  constructor() {
    effect(() => {
      if (this.sesionService.sesionIniciada()) {
        this.tokenExiste.set(true);
        clearInterval(this.intervalo);
        this.iniciarContador();
        setTimeout(() => {
          this.sesionService.sesionIniciada.set(false);
        }, 0);
      }
    });
  }

  ngOnInit() {
    this.iniciarContador();
  }

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  iniciarContador() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    this.segundosRestantes.set(2 * 60);

    this.intervalo = setInterval(() => {
      this.segundosRestantes.update((v) => Math.max(v - 1, 0));

      if (this.segundosRestantes() === 1 * 60) {
        this.mostrarModal = true;
      }

      if (this.segundosRestantes() <= 0) {
        clearInterval(this.intervalo);
        this.tokenExiste.set(false);
      }
    }, 1000);
  }

  extenderSesion() {
    const token = localStorage.getItem('token');

    this.http
      .post(
        `${this.apiUrl}/autenticacion/refrescar`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'text' },
      )
      .subscribe({
        next: (nuevoToken: any) => {
          localStorage.setItem('token', nuevoToken);
          this.mostrarModal = false;
          clearInterval(this.intervalo);
          this.iniciarContador();
        },
        error: (error) => {
          console.log('Error al refrescar:', error);
          this.mostrarModal = false;
          this.router.navigateByUrl('/login');
        },
      });
  }
}
