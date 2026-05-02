import { Routes } from '@angular/router';
import { LayoutInicial } from './pages/layout-inicial/layout-inicial';
import { LogIn } from './pages/log-in/log-in';
import { RegistrarEmpresa } from './pages/registrar-empresa/registrar-empresa';
import { DashboardGeneral } from './pages/dashboard-general/dashboard-general';
import { ConsultarProcesos } from './pages/consultar-procesos/consultar-procesos';
import { EditarProcesos } from './pages/editar-procesos/editar-procesos';


export const routes: Routes = [
  { path: '', component: LayoutInicial }, 
  { path: 'log-in', component: LogIn },    
  { path: 'registrar-empresa', component: RegistrarEmpresa } ,
  { path: 'dashboard-general', component: DashboardGeneral},
  { path: 'consultar-procesos', component: ConsultarProcesos},
  { path: 'editar-procesos', component: EditarProcesos},
];