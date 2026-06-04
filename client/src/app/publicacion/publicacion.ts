import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  _publicacion = signal<any>(null);

  @Input() set publicacion(valor: any) {
    this._publicacion.set(valor);
  }

  get publicacion() {
    return this._publicacion();
  }

  token = localStorage.getItem('token');
  usuarioId = JSON.parse(localStorage.getItem('usuario')!)?._id;

  darLike() {
    const peticion = this.http.post(
      `${this.apiUrl}/publicaciones/${this.publicacion._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` },
      },
    );

    peticion.subscribe({
      next: () => {
        this._publicacion.update((p) => ({
          ...p,
          meGusta: [...p.meGusta, this.usuarioId],
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  quitarLike() {
    const peticion = this.http.delete(
      `${this.apiUrl}/publicaciones/${this.publicacion._id}/dislike`,
      { headers: { Authorization: `Bearer ${this.token}` } },
    );

    peticion.subscribe({
      next: () => {
        this._publicacion.update((p: any) => ({
          ...p,
          meGusta: p.meGusta.filter((id: string) => id !== this.usuarioId),
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  eliminar() {
    const peticion = this.http.delete(`${this.apiUrl}/publicaciones/${this.publicacion._id}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    peticion.subscribe({
      next: () => {
        this._publicacion.update((p: any) => ({
          ...p,
          activo: false,
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
