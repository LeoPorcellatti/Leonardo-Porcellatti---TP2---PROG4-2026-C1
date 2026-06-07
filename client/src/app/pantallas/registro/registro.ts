import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../validators/passwordValidator';
import { edadValidator } from '../../validators/edadValidator';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = environment.apiUrl;
  imagenDePerfil: File | null = null;

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    nombreDeUsuario: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, passwordValidator]),
    fechaDeNacimiento: new FormControl('', [Validators.required, edadValidator]),
    descripcion: new FormControl('', Validators.required),
  });

  capturarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenDePerfil = input.files[0];
    }
  }

  registro(
    nombre: string,
    apellido: string,
    email: string,
    nombreDeUsuario: string,
    password: string,
    fechaDeNacimiento: string,
    descripcion: string,
  ) {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

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

    const peticion = this.http.post(`${this.apiUrl}/autenticacion/registro`, formRegistro, {
      responseType: 'text',
    });

    peticion.subscribe({
      next: (a) => {
        if (a) {
          localStorage.setItem('token', a);
          this.router.navigateByUrl('/publicaciones');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
