import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'solicitudes' },
          {
            path: 'solicitudes',
            loadComponent: () =>
              import('./features/admin/solicitudes/admin-solicitudes').then(
                (m) => m.AdminSolicitudes,
              ),
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('./features/admin/usuarios/usuarios').then((m) => m.Usuarios),
          },
          {
            path: 'clientes',
            loadComponent: () =>
              import('./features/admin/clientes/clientes').then((m) => m.Clientes),
          },
          {
            path: 'tecnicos',
            loadComponent: () =>
              import('./features/admin/tecnicos/tecnicos').then((m) => m.Tecnicos),
          },
        ],
      },
      {
        path: 'cliente',
        canActivate: [roleGuard('CLIENTE')],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'mis-solicitudes' },
          {
            path: 'mis-solicitudes',
            loadComponent: () =>
              import('./features/cliente/mis-solicitudes/mis-solicitudes').then(
                (m) => m.MisSolicitudes,
              ),
          },
        ],
      },
      {
        path: 'tecnico',
        canActivate: [roleGuard('TECNICO')],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'mis-asignaciones' },
          {
            path: 'mis-asignaciones',
            loadComponent: () =>
              import('./features/tecnico/mis-asignaciones/mis-asignaciones').then(
                (m) => m.MisAsignaciones,
              ),
          },
        ],
      },
      { path: '', pathMatch: 'full', redirectTo: 'admin' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];