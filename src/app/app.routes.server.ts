import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
  },
  {
    path: 'log-in',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registrar-empresa',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard-general',
    renderMode: RenderMode.Client,
  },
  {
    path: 'consultar-procesos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'editar-procesos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestor-procesos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestor-roles',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestor-usuarios',
    renderMode: RenderMode.Client,
  },

  { path: 'modelador-proceso', renderMode: RenderMode.Client },
  { path: 'modelador-proceso/:id', renderMode: RenderMode.Client },
  { path: 'formulario-proceso', renderMode: RenderMode.Client },
  { path: 'formulario-proceso/:id', renderMode: RenderMode.Client },
];
