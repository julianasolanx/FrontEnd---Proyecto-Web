import { Usuario } from './usuario.model';
import { Proceso } from './proceso.model';
import { RolProceso } from './rolproceso.model';
 
export interface Empresa {
  id: number;
  nombre: string;
  nit: string;
  correoContacto: string;
  status: number;
  usuarios?: Usuario[];
  procesos?: Proceso[];
  roles?: RolProceso[];
}
 
export interface EmpresaRequest {
  nombre: string;
  nit: string;
  correoContacto: string;
}
 