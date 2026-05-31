import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  imports: [RouterLink],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit {
  router = inject(Router);

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigateByUrl('/registro');
    }
  }
}
