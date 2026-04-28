export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'INICIO' | 'TAREA' | 'DECISION' | 'FIN';
  procesoId: number;
  rolResponsableId?: number;
}

export interface CrearActividad {
  nombre: string;
  descripcion?: string;
  tipo: string;
  procesoId: number;
  rolResponsableId?: number;
}
