import { Empresa } from './empresa.model';
import { Actividad } from './actividad.model';
 
export interface RolProceso {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  empresa: Empresa;
  actividades?: Actividad[];
}
 
export interface RolProcesoRequest {
  nombre: string;
  descripcion: string;
  empresaId: number;
}
 