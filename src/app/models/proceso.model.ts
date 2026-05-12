import { Empresa } from './empresa.model';
import { Actividad } from './actividad.model';
import { Gateway } from './gateway.model';
import { Arco } from './arco.model';
 
export type EstadoProceso = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';
 
export interface Proceso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: EstadoProceso;
  status: number;
  esCompartido?: boolean;
  poolId?: number;
  empresa: Empresa;
  actividades?: Actividad[];
  gateways?: Gateway[];
  arcos?: Arco[];
}

export interface ProcesoRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: EstadoProceso;
  empresaId: number;
  esCompartido?: boolean;
}
 