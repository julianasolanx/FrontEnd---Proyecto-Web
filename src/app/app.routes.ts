import { Routes } from '@angular/router';
import { LayoutInicial } from './pages/layout-inicial/layout-inicial';
import { LogIn } from './pages/log-in/log-in';
import { RegistrarEmpresa } from './pages/registrar-empresa/registrar-empresa';
import { DashboardGeneral } from './pages/dashboard-general/dashboard-general';
import { GestorUsuarios } from './pages/gestor-usuarios/gestor-usuarios';
import { GestorProcesos } from './pages/gestor-procesos/gestor-procesos';
import { GestorRoles } from './pages/gestor-roles/gestor-roles';
import { ModeladorProceso } from './pages/modelador-proceso/modelador-proceso';
import { FormularioProceso } from './pages/formulario-proceso/formulario-proceso';
import { GestorPool } from './pages/gestor-pool/gestor-pool';
import { GestorMensajes } from './pages/gestor-mensajes/gestor-mensajes';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LayoutInicial },
  { path: 'log-in', component: LogIn },
  { path: 'registrar-empresa', component: RegistrarEmpresa },
  { path: 'dashboard-general', component: DashboardGeneral, canActivate: [authGuard] },
  { path: 'gestor-usuarios', component: GestorUsuarios, canActivate: [authGuard] },
  { path: 'gestor-procesos', component: GestorProcesos, canActivate: [authGuard] },
  { path: 'gestor-roles', component: GestorRoles, canActivate: [authGuard] },
  { path: 'gestor-pool', component: GestorPool, canActivate: [authGuard] },
  { path: 'modelador-proceso', component: ModeladorProceso, canActivate: [authGuard] },
  { path: 'modelador-proceso/:id', component: ModeladorProceso, canActivate: [authGuard] },
  { path: 'formulario-proceso', component: FormularioProceso, canActivate: [authGuard] },
  { path: 'formulario-proceso/:id', component: FormularioProceso, canActivate: [authGuard] },
  { path: 'gestor-mensajes/:procesoId', component: GestorMensajes, canActivate: [authGuard] },
];
