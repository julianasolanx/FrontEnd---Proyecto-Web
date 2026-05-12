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

export const routes: Routes = [
  { path: '', component: LayoutInicial },
  { path: 'log-in', component: LogIn },
  { path: 'registrar-empresa', component: RegistrarEmpresa },
  { path: 'dashboard-general', component: DashboardGeneral },
  { path: 'gestor-usuarios', component: GestorUsuarios },
  { path: 'gestor-procesos', component: GestorProcesos },
  { path: 'gestor-roles', component: GestorRoles },
  { path: 'gestor-pool', component: GestorPool },
  { path: 'modelador-proceso', component: ModeladorProceso },
  { path: 'modelador-proceso/:id', component: ModeladorProceso },
  { path: 'formulario-proceso', component: FormularioProceso },
  { path: 'formulario-proceso/:id', component: FormularioProceso },
  { path: 'gestor-mensajes/:procesoId', component: GestorMensajes },
];
