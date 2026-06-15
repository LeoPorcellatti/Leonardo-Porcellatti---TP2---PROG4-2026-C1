import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../../services/sesion-service';
import { environment } from '../../../../environments/environment';
import { TituloModalPipe } from '../../../pipes/titulo-modal-pipe';

@Component({
  selector: 'app-usuarios',
  imports: [TituloModalPipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  http = inject(HttpClient);
  router = inject(Router);
  sesionService = inject(SesionService);
  apiUrl = environment.apiUrl;

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  usuarios: WritableSignal<any[]> = signal([]);

  modalAbierto: boolean = false;
  tipoModal = '';

  abrirModal(tipo: string) {
    this.tipoModal = tipo;
    this.modalAbierto = true;

    if (tipo === 'listadoUsuarios') {
      this.cargarUsuarios();
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

    console.log('TOKEN:', token);

    peticion.subscribe({
      next: (a: any) => {
        this.usuarios.set(a);
        console.log('llego la peticion');
        console.log(this.usuarios);
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
}
