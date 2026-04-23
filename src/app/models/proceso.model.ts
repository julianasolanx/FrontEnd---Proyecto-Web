export interface Proceso {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: 'PUBLICADO' | 'BORRADOR' | 'INACTIVO';
  empresaId: number;
}
