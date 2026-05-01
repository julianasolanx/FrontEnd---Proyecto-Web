import { Proceso } from './proceso.model';
 
export type TipoGateway = 'EXCLUSIVO' | 'PARALELO' | 'INCLUSIVO';
 
export interface Gateway {
  id: number;
  nombre: string;
  tipo: TipoGateway;
  status: number;
  proceso: Proceso;
}
 
export interface GatewayRequest {
  nombre: string;
  tipo: TipoGateway;
  procesoId: number;
}
 