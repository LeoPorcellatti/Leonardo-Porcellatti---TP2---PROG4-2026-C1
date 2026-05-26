import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pantallas/login/login').then((a) => a.Login),
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pantallas/mi-perfil/mi-perfil').then((a) => a.MiPerfil),
  },

  {
    path: 'publicaciones',
    loadComponent: () =>
      import('./pantallas/publicaciones/publicaciones').then((a) => a.Publicaciones),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pantallas/registro/registro').then((a) => a.Registro),
  },
];
