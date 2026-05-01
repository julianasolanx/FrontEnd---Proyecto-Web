import { Proceso } from './proceso.model';
import { Actividad } from './actividad.model';
import { Gateway } from './gateway.model';
 
export interface Arco {
  id: number;
  condicion: string;
  status: number;
  proceso: Proceso;
  actividadOrigen?: Actividad;
  gatewayOrigen?: Gateway;
  actividadDestino?: Actividad;
  gatewayDestino?: Gateway;
}
 
export interface ArcoRequest {
  condicion: string;
  procesoId: number;
  actividadOrigenId?: number;
  gatewayOrigenId?: number;
  actividadDestinoId?: number;
  gatewayDestinoId?: number;
}
 