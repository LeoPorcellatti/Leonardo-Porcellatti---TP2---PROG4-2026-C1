import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SesionService } from '../../../services/sesion-service';
import { environment } from '../../../../environments/environment';
import { TituloModalPipe } from '../../../pipes/titulo-modal-pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../validators/passwordValidator';
import { edadValidator } from '../../../validators/edadValidator';
import { ConfirmarAccion } from '../../../directivas/confirmar-accion';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, RouterLink, TituloModalPipe, ConfirmarAccion],
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
  modalConfirmacion = false;
  tipoModal = '';
  mensajeConfirmacion = '';
  usuarioAModificar = '';
  estadoAModificar: boolean = false;

  imagenDePerfil: File | null = null;
  imagenDePerfilError: boolean = false;

  formulario = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    nombreDeUsuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, passwordValidator]),
    repetirPassword: new FormControl('', [Validators.required, passwordValidator]),
    fechaDeNacimiento: new FormControl('', [Validators.required, edadValidator]),
    descripcion: new FormControl('', [Validators.required]),
    perfil: new FormControl('usuario', [Validators.required]),
  });

  capturarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenDePerfil = input.files[0];
    }
  }

  abrirModal(tipo: string) {
    this.tipoModal = tipo;
    this.modalAbierto = true;

    if (tipo === 'listadoUsuarios') {
      this.cargarUsuarios();
    }

    if (tipo === 'crearUsuario') {
      this.formulario.reset();
    }

    if (tipo === 'habilitarDeshabilitarUsuario') {
      this.cargarUsuarios();
    }
  }

  abrirModalConfirmacion(mensaje: string, id: string, estado: boolean) {
    this.mensajeConfirmacion = mensaje;
    this.usuarioAModificar = id;
    this.estadoAModificar = estado;
    this.modalConfirmacion = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.tipoModal = '';
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacion = false;

    this.usuarioAModificar = '';
    this.estadoAModificar = false;
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

  crearUsuario(
    nombre: string,
    apellido: string,
    email: string,
    nombreDeUsuario: string,
    password: string,
    fechaDeNacimiento: string,
    descripcion: string,
    perfil: string,
  ) {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (this.formulario.value.password !== this.formulario.value.repetirPassword) {
      return;
    }

    if (!this.imagenDePerfil) {
      this.imagenDePerfilError = true;
      return;
    }

    const token = localStorage.getItem('token');

    const formRegistro = new FormData();
    formRegistro.append('nombre', nombre);
    formRegistro.append('apellido', apellido);
    formRegistro.append('email', email);
    formRegistro.append('nombreDeUsuario', nombreDeUsuario);
    formRegistro.append('password', password);
    formRegistro.append('fechaDeNacimiento', fechaDeNacimiento);
    formRegistro.append('descripcion', descripcion);
    if (this.imagenDePerfil) {
      formRegistro.append('imagenDePerfil', this.imagenDePerfil);
    }
    formRegistro.append('perfil', perfil);

    const peticion = this.http.post(`${this.apiUrl}/usuarios`, formRegistro, {
      headers: { Authorization: `Bearer ${token}` },
    });

    peticion.subscribe({
      next: (a: any) => {
        this.formulario.reset();
        this.imagenDePerfil = null;
        this.imagenDePerfilError = false;

        this.cerrarModal();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  cambiarEstado(id: string, activo: boolean) {
    const token = localStorage.getItem('token');

    if (!activo) {
      const peticion = this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      peticion.subscribe({
        next: (a: any) => {
          this.cargarUsuarios();

          return;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    if (activo) {
      const peticion = this.http.post(
        `${this.apiUrl}/usuarios/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      peticion.subscribe({
        next: (a: any) => {
          this.cargarUsuarios();

          return;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  confirmarCambioEstado() {
    this.cambiarEstado(this.usuarioAModificar, this.estadoAModificar);

    this.cerrarModalConfirmacion();
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.sesionService.sesionCerrada.set(true);
    this.router.navigateByUrl('/login');
  }
}
