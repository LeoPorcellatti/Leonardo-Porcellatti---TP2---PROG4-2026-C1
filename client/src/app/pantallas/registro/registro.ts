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

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    nombreDeUsuario: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, passwordValidator]),
    fechaDeNacimiento: new FormControl('', [Validators.required, edadValidator]),
    descripcion: new FormControl('', Validators.required),
    imagenDePerfil: new FormControl('', Validators.required),
  });

  registro(
    nombre: string,
    apellido: string,
    email: string,
    nombreDeUsuario: string,
    password: string,
    fechaDeNacimiento: string,
    descripcion: string,
    imagenDePerfil: string,
  ) {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const peticion = this.http.post(
      `${this.apiUrl}/autenticacion/registro`,
      {
        nombre: nombre,
        apellido: apellido,
        email: email,
        nombreDeUsuario: nombreDeUsuario,
        password: password,
        fechaDeNacimiento: fechaDeNacimiento,
        descripcion: descripcion,
        imagenDePerfil: imagenDePerfil,
      },
      { responseType: 'text' },
    );

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
