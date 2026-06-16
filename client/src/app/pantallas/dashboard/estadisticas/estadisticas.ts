import { Component, inject, OnInit, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion-service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TituloModalPipe } from '../../../pipes/titulo-modal-pipe';
import { FormsModule } from '@angular/forms';
import { PublicacionesPorUsuario } from '../../../interfaces/publicacionesPorUsuario';
import { Chart } from 'chart.js/auto';

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

  publicacionesUsuarios = signal<PublicacionesPorUsuario[]>([]);
  usuarios = signal<any[]>([]);

  modalAbierto: boolean = false;
  tipoModal = '';

  desde = '';
  hasta = '';

  graficoPublicaciones: Chart | null = null;

  abrirModal(tipo: string) {
    this.tipoModal = tipo;
    this.modalAbierto = true;

    if (tipo === 'publicacionPorUsuario') {
    }

    if (tipo === 'comentariosTotales') {
      this.comentariosPorFechas();
    }

    if (tipo === 'comentariosPorPublicacion') {
      this.comentariosPorPublicacion();
    }
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

  publicacionesPorUsuario(desde: string, hasta: string) {
    const token = localStorage.getItem('token');
    const peticion = this.http.get<PublicacionesPorUsuario[]>(
      `${this.apiUrl}/estadisticas/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    peticion.subscribe({
      next: (data: PublicacionesPorUsuario[]) => {
        const labels = data.map((publicacion) => {
          const usuario = this.usuarios().find((u) => u._id === publicacion._id);

          return usuario?.nombreDeUsuario ?? 'Desconocido';
        });

        const valores = data.map((publicacion) => publicacion.cantidad);

        console.log(labels);
        console.log(valores);

        this.crearGraficoPublicacionesUsuarios(labels, valores);

        this.publicacionesUsuarios.set(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
    console.log('Desde: ', desde, '- Hasta: ', hasta);
  }

  comentariosPorFechas() {}

  comentariosPorPublicacion() {}

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sesionService.sesionCerrada.set(true);
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    this.cargarUsuarios();
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
}
