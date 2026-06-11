import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publicacion-ampliada',
  imports: [RouterLink, DatePipe],
  templateUrl: './publicacion-ampliada.html',
  styleUrl: './publicacion-ampliada.css',
})
export class PublicacionAmpliada implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  apiUrl = environment.apiUrl;

  token = localStorage.getItem('token');
  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  publicacion = signal<any>(null);
  comentarios = signal<any[]>([]);
  totalComentarios = signal<number>(0);
  nuevoComentario = '';
  limite = 3;
  offset = 0;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.traerPublicacion(id);
      }
    });
  }

  traerPublicacion(id: string) {
    this.http
      .get(`${this.apiUrl}/publicaciones/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .subscribe({
        next: (data: any) => this.publicacion.set(data),
        error: (error) => console.log(error),
      });
  }

  // traerComentarios(id: string) {
  //   this.http
  //     .get(`${this.apiUrl}/comentarios/${id}?limite=${this.limite}&offset=${this.offset}`, {
  //       headers: { Authorization: `Bearer ${this.token}` },
  //     })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.comentarios.update((prev) => [...prev, ...data.comentarios]);
  //         this.totalComentarios.set(data.total);
  //         this.offset += this.limite;
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  // }
}
