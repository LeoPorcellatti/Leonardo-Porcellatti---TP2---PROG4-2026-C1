import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SesionService } from '../../services/sesion-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  http = inject(HttpClient);
  router = inject(Router);
  sesionService = inject(SesionService);
  apiUrl = environment.apiUrl;

  formulario = new FormGroup({
    metodoIngreso: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  mostrarModalUsuarioDeshabilitado = false;

  login(metodoIngreso: string, password: string) {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const peticion = this.http.post(`${this.apiUrl}/autenticacion/login`, {
      metodoIngreso: metodoIngreso,
      password: password,
    });

    peticion.subscribe({
      next: (a: any) => {
        localStorage.setItem('token', a.token);
        localStorage.setItem('usuario', JSON.stringify(a.usuario));

        this.sesionService.sesionIniciada.set(true);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        if (error.status === 403 && error.error.message === 'Usuario deshabilitado') {
          this.mostrarModalUsuarioDeshabilitado = true;
          this.formulario.reset();
          return;
        }
      },
    });
  }

  cerrarModal() {
    this.mostrarModalUsuarioDeshabilitado = false;
  }
}
