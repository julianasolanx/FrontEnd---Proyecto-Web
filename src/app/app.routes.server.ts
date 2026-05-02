import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client
  },
  {
    path: 'log-in',
    renderMode: RenderMode.Client
  },
  {
    path: 'registrar-empresa',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard-general',
    renderMode: RenderMode.Client
  },
  {
    path: 'consultar-procesos',
    renderMode: RenderMode.Client
  },
  {
    path: 'editar-procesos',
    renderMode: RenderMode.Client
  }

  
  
];
