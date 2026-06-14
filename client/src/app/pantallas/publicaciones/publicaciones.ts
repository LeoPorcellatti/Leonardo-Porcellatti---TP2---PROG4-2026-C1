import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { Publicacion } from '../../publicacion/publicacion';
import { SesionService } from '../../services/sesion-service';

@Component({
  selector: 'app-publicaciones',
  imports: [FormsModule, RouterLink, Publicacion],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  sesionService = inject(SesionService);
  apiUrl = environment.apiUrl;

  imagenDePublicacion: File | null = null;

  publicaciones: WritableSignal<any[]> = signal([]);
  orden: string = 'fecha';
  limite: number = 5;
  offset: number = 0;

  modalAbierto: boolean = false;
  nuevaPublicacion = { titulo: '', descripcion: '', imagenUrl: '' };

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sesionService.sesionCerrada.set(true);
    this.router.navigateByUrl('/login');
  }

  cargarPublicaciones() {
    const token = localStorage.getItem('token');
    const peticion = this.http.get(
      `${this.apiUrl}/publicaciones?orden=${this.orden}&limite=${this.limite}&offset=${this.offset}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    peticion.subscribe({
      next: (a: any) => {
        this.publicaciones.set(a);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigateByUrl('/registro');
    } else {
      this.cargarPublicaciones();
    }
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  paginaSiguiente() {
    console.log('paginaSiguiente ejecutado');
    this.offset += this.limite;
    this.cargarPublicaciones();
  }

  paginaAnterior() {
    if (this.offset > 0) {
      this.offset -= this.limite;
      this.cargarPublicaciones();
    }
  }

  capturarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenDePublicacion = input.files[0];
    }
  }

  publicar() {
    if (!this.nuevaPublicacion.titulo || !this.nuevaPublicacion.descripcion) {
      return;
    }
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('titulo', this.nuevaPublicacion.titulo);
    formData.append('descripcion', this.nuevaPublicacion.descripcion);
    if (this.imagenDePublicacion) {
      formData.append('imagenDePublicacion', this.imagenDePublicacion);
    }

    this.http
      .post(`${this.apiUrl}/publicaciones`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.cerrarModal();
          this.offset = 0;
          this.cargarPublicaciones();
          this.nuevaPublicacion = { titulo: '', descripcion: '', imagenUrl: '' };
          this.imagenDePublicacion = null;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
