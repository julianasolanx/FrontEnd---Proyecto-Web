export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  empresaId: number;
}

export interface CrearUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
  empresaId?: number;
}
