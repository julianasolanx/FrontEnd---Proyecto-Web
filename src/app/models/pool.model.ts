export interface Pool {
  id: number;
  nombre: string;
  descripcion: string;
  empresaId: number;
  empresaNombre?: string;
}

export interface PoolRequest {
  nombre: string;
  descripcion: string;
  empresaId: number;
}
