import { Routes } from '@angular/router';
import { estaLogueadoGuard } from './guards/esta-logueado-guard';
import { noEstaLogueadoGuard } from './guards/no-esta-logueado-guard';
import { usuarioEsAdminGuard } from './guards/usuario-es-admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pantallas/cargando/cargando').then((a) => a.Cargando),
  },
  {
    path: 'login',
    canActivate: [estaLogueadoGuard],
    loadComponent: () => import('./pantallas/login/login').then((a) => a.Login),
  },
  {
    path: 'mi-perfil',
    canActivate: [noEstaLogueadoGuard],
    loadComponent: () => import('./pantallas/mi-perfil/mi-perfil').then((a) => a.MiPerfil),
  },
  {
    path: 'publicaciones',
    canActivate: [noEstaLogueadoGuard],
    loadComponent: () =>
      import('./pantallas/publicaciones/publicaciones').then((a) => a.Publicaciones),
  },
  {
    path: 'publicaciones/:id',
    canActivate: [noEstaLogueadoGuard],
    loadComponent: () =>
      import('./pantallas/publicacion-ampliada/publicacion-ampliada').then(
        (a) => a.PublicacionAmpliada,
      ),
  },
  {
    path: 'registro',
    canActivate: [estaLogueadoGuard],
    loadComponent: () => import('./pantallas/registro/registro').then((a) => a.Registro),
  },
  {
    path: 'dashboard',
    canActivate: [usuarioEsAdminGuard],
    loadComponent: () => import('./pantallas/dashboard/dashboard').then((a) => a.Dashboard),
  },
  {
    path: 'usuarios',
    canActivate: [usuarioEsAdminGuard],
    loadComponent: () => import('./pantallas/dashboard/usuarios/usuarios').then((a) => a.Usuarios),
  },
  {
    path: 'estadisticas',
    canActivate: [usuarioEsAdminGuard],
    loadComponent: () =>
      import('./pantallas/dashboard/estadisticas/estadisticas').then((a) => a.Estadisticas),
  },
];
