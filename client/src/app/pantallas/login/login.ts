import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  formulario = new FormGroup({
    metodoIngreso: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  login(metodoIngreso: string, password: string) {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    try {
      const peticion = this.http.post(
        `${this.apiUrl}/autenticacion/login`,
        {
          metodoIngreso: metodoIngreso,
          password: password,
        },
        { responseType: 'text' },
      );

      peticion.subscribe((a) => {
        if (a) {
          this.router.navigateByUrl('/publicaciones');
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
