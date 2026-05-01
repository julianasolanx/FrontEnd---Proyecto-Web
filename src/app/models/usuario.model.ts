import { Empresa } from './empresa.model';
 
export type RolUsuario = 'ADMINISTRADOR' | 'EDITOR' | 'SOLO_LECTURA';
 
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  status: number;
  empresa?: Empresa;
}
 
export interface UsuarioRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  empresaId?: number;
}
 