import { Component, inject, OnInit, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion-service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TituloModalPipe } from '../../../pipes/titulo-modal-pipe';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { DatoPorFecha } from '../../../interfaces/datoPorFecha';

@Component({
  selector: 'app-estadisticas',
  imports: [FormsModule, RouterLink, TituloModalPipe],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  sesionService = inject(SesionService);
  apiUrl = environment.apiUrl;

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  datoPorFecha = signal<DatoPorFecha[]>([]);
  usuarios = signal<any[]>([]);
  publicaciones = signal<any[]>([]);

  modalAbierto: boolean = false;
  tipoModal = '';

  desde = '';
  hasta = '';

  graficoPublicaciones: Chart | null = null;
  graficoComentarios: Chart | null = null;
  graficoComentariosPorPublicacion: Chart | null = null;

  abrirModal(tipo: string) {
    this.tipoModal = tipo;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.tipoModal = '';
  }

  cargarUsuarios() {
    const token = localStorage.getItem('token');
    const peticion = this.http.get(`${this.apiUrl}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    peticion.subscribe({
      next: (a: any) => {
        this.usuarios.set(a);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cargarPublicaciones() {
    const token = localStorage.getItem('token');

    const peticion = this.http.get(`${this.apiUrl}/publicaciones?limite=9999`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    peticion.subscribe({
      next: (a: any) => {
        this.publicaciones.set(a);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  publicacionesPorUsuario(desde: string, hasta: string) {
    const token = localStorage.getItem('token');
    const peticion = this.http.get<DatoPorFecha[]>(
      `${this.apiUrl}/estadisticas/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    peticion.subscribe({
      next: (data: DatoPorFecha[]) => {
        const labels = data.map((publicacion) => {
          const usuario = this.usuarios().find((u) => u._id === publicacion._id);

          return usuario?.nombreDeUsuario ?? 'Anon';
        });

        const valores = data.map((publicacion) => publicacion.cantidad);

        this.crearGraficoPublicacionesUsuarios(labels, valores);

        this.datoPorFecha.set(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  comentariosPorFechas(desde: string, hasta: string) {
    const token = localStorage.getItem('token');
    const peticion = this.http.get<DatoPorFecha[]>(
      `${this.apiUrl}/estadisticas/comentarios-por-fecha?desde=${desde}&hasta=${hasta}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    peticion.subscribe({
      next: (data: DatoPorFecha[]) => {
        const labels = data.map((comentarios) => {
          const usuario = this.usuarios().find((u) => u._id === comentarios._id);

          return usuario?.nombreDeUsuario ?? 'Anon';
        });

        const valores = data.map((comentarios) => comentarios.cantidad);

        this.crearGraficoComentariosPorFecha(labels, valores);

        this.datoPorFecha.set(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  comentariosPorPublicacion(desde: string, hasta: string) {
    const token = localStorage.getItem('token');
    const peticion = this.http.get<DatoPorFecha[]>(
      `${this.apiUrl}/estadisticas/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    peticion.subscribe({
      next: (data: DatoPorFecha[]) => {
        const labels = data.map((comentarios) => {
          const publicacion = this.publicaciones().find((p) => p._id === comentarios._id);

          return publicacion?.titulo ?? 'Publicación eliminada';
        });

        const valores = data.map((comentarios) => comentarios.cantidad);

        this.crearGraficoComentariosPorPublicacion(labels, valores);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sesionService.sesionCerrada.set(true);
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPublicaciones();
  }

  crearGraficoPublicacionesUsuarios(labels: string[], valores: number[]) {
    if (this.graficoPublicaciones) {
      this.graficoPublicaciones.destroy();
    }

    this.graficoPublicaciones = new Chart('graficoPublicaciones', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de publicaciones',
            data: valores,

            backgroundColor: 'rgba(57, 255, 138, 0.5)',
            borderColor: '#39ff8a',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  crearGraficoComentariosPorFecha(labels: string[], valores: number[]) {
    if (this.graficoComentarios) {
      this.graficoComentarios.destroy();
    }

    this.graficoComentarios = new Chart('graficoComentarios', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Comentarios',
            data: valores,

            backgroundColor: 'rgba(57, 255, 138, 0.5)',
            borderColor: '#39ff8a',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  crearGraficoComentariosPorPublicacion(labels: string[], valores: number[]) {
    if (this.graficoComentariosPorPublicacion) {
      this.graficoComentariosPorPublicacion.destroy();
    }

    this.graficoComentariosPorPublicacion = new Chart('graficoComentariosPublicacion', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Comentarios por Publicación',
            data: valores,

            backgroundColor: [
              '#39ff8a',
              '#24653f',
              '#ff6b6b',
              '#ffd93d',
              '#b967ff',
              '#ff9f1c',
              '#2ec4b6',
              '#e71d36',
              '#8338ec',
              '#24653f',
            ],
            borderColor: '#24653f',
            borderWidth: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
