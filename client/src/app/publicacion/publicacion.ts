import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmarAccion } from '../directivas/confirmar-accion';
import { ImagenAmpliada } from '../directivas/imagen-ampliada';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, ConfirmarAccion, ImagenAmpliada],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class Publicacion {
  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  _publicacion = signal<any>(null);

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  modalConfirmacion = false;
  mensajeConfirmacion = '';

  modalImagen = false;
  imagenPublicacion = '';

  @Input() set publicacion(valor: any) {
    this._publicacion.set(valor);
  }

  get publicacion() {
    return this._publicacion();
  }

  publicar() {
    const token = localStorage.getItem('token');
    const peticion = this.http.post(
      `${this.apiUrl}/publicaciones`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    peticion.subscribe({
      next: () => {},
    });
  }

  darLike() {
    const token = localStorage.getItem('token');
    const peticion = this.http.post(
      `${this.apiUrl}/publicaciones/${this.publicacion._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    peticion.subscribe({
      next: () => {
        this._publicacion.update((p) => ({
          ...p,
          meGusta: [...p.meGusta, this.usuario._id],
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  quitarLike() {
    const token = localStorage.getItem('token');
    const peticion = this.http.delete(
      `${this.apiUrl}/publicaciones/${this.publicacion._id}/dislike`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    peticion.subscribe({
      next: () => {
        this._publicacion.update((p: any) => ({
          ...p,
          meGusta: p.meGusta.filter((id: string) => id !== this.usuario._id),
        }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  eliminar() {
    const token = localStorage.getItem('token');
    const peticion = this.http.delete(`${this.apiUrl}/publicaciones/${this.publicacion._id}`, {
      headers: { Authorization: `Bearer ${token}` },
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

  verPublicacion() {
    this.router.navigateByUrl(`/publicaciones/${this.publicacion._id}`);
  }

  abrirModalConfirmacion(mensaje: string) {
    this.mensajeConfirmacion = mensaje;
    this.modalConfirmacion = true;
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacion = false;
  }

  confirmarEliminacion() {
    this.eliminar();
    this.cerrarModalConfirmacion();
  }

  abrirModalImagen(src: string) {
    this.imagenPublicacion = src;
    this.modalImagen = true;
  }

  cerrarModalImagen() {
    this.modalImagen = false;
    this.imagenPublicacion = '';
  }
}
