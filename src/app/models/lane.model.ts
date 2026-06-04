export interface Lane {
  id: number;
  nombre: string;
  descripcion: string;
  poolId: number;
}

export interface LaneRequest {
  nombre: string;
  descripcion: string;
  poolId: number;
}
