import { Empresa } from './empresa.model';
import { Actividad } from './actividad.model';
 
export type Permiso =
  | 'CREAR_PROCESO'
  | 'EDITAR_PROCESO'
  | 'ELIMINAR_PROCESO'
  | 'PUBLICAR_PROCESO'
  | 'GESTIONAR_ROLES'
  | 'GESTIONAR_USUARIOS'
  | 'VER_PROCESOS_COMPARTIDOS';

export interface RolProceso {
  id: number;
  nombre: string;
  descripcion: string;
  status: number;
  empresa: Empresa;
  actividades?: Actividad[];
  permisos?: Permiso[];
}

export interface RolProcesoRequest {
  nombre: string;
  descripcion: string;
  empresaId: number;
  permisos?: Permiso[];
}
 