export interface MensajeProceso {
  id: number;
  nombre: string;
  tipo: 'THROW' | 'CATCH';
  payloadTemplate: string;
  businessKey: string;
  procesoId: number;
  actividadId?: number;
}

export interface MensajeRequest {
  nombre: string;
  tipo: 'THROW' | 'CATCH';
  payloadTemplate: string;
  businessKey: string;
  procesoId: number;
  actividadId?: number;
}

export interface EventoMensaje {
  id: number;
  nombreMensaje: string;
  businessKey: string;
  payload: string;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'ERROR' | 'NO_CORRELACIONADO';
  fechaEnvio: string;
  fechaEntrega?: string;
  mensajeId?: number;
  procesoEmisorId?: number;
  procesoReceptorId?: number;
}

export interface ReglaCorrelacion {
  id: number;
  nombreMensaje: string;
  tipoCorrelacion: 'BUSINESS_KEY' | 'VARIABLE' | 'EXPRESION';
  valorCorrelacion: string;
  politicaMultiple: 'ERROR' | 'PRIMERA' | 'NUEVA_INSTANCIA';
  procesoId: number;
  mensajeId?: number;
}

export interface ProcesoAcceso {
  id: number;
  procesoId: number;
  empresaId: number;
  empresaNombre: string;
  tipoAcceso: 'LECTURA' | 'EDICION';
}
