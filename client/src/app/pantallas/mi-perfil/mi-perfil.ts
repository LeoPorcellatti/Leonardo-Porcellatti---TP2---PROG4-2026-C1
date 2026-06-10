import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Publicacion } from '../../publicacion/publicacion';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink, Publicacion],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  token = localStorage.getItem('token');
  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  publicaciones: WritableSignal<any[]> = signal([]);

  orden: string = 'fecha';
  limite: number = 3;

  cargarUltimasPublicaciones() {
    const peticion = this.http.get(
      `${this.apiUrl}/publicaciones?orden=${this.orden}&limite=${this.limite}`,
      { headers: { Authorization: `Bearer ${this.token}` } },
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
    this.cargarUltimasPublicaciones();
  }
}
