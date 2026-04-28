export interface HistorialCambio {
  id: number;
  entidad: string;
  entidadId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  fechaCambio: string;
  procesoId: number;
}
