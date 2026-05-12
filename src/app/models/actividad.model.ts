import { Proceso } from './proceso.model';
import { RolProceso } from './rolproceso.model';

export type TipoActividad = 'TAREA' | 'SUBPROCESO' | 'EVENTO_INICIO' | 'EVENTO_FIN' | 'MESSAGE_THROW' | 'MESSAGE_CATCH';

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: TipoActividad;
  status: number;
  proceso: Proceso;
  rolResponsable?: RolProceso;
  laneId?: number;
  posicionX?: number;
  posicionY?: number;
}

export interface CrearActividad {
  nombre: string;
  descripcion: string;
  tipo: TipoActividad;
  procesoId: number;
  rolResponsableId?: number;
  laneId?: number;
  posicionX?: number;
  posicionY?: number;
}
