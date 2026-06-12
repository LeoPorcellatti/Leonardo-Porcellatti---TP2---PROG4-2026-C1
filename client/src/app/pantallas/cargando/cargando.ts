import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cargando',
  imports: [],
  templateUrl: './cargando.html',
  styleUrl: './cargando.css',
})
export class Cargando implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  token = localStorage.getItem('token');

  ngOnInit() {
    if (!this.token) {
      this.router.navigateByUrl('/login');
      return;
    }

    setTimeout(() => {
      this.http
        .post(
          `${this.apiUrl}/autenticacion/autorizar`,
          {},
          { headers: { Authorization: `Bearer ${this.token}` } },
        )
        .subscribe({
          next: (usuario: any) => {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.router.navigateByUrl('/publicaciones');
          },
          error: (error) => {
            console.log(error);
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            this.router.navigateByUrl('/login');
          },
        });
    }, 3000);
  }
}
