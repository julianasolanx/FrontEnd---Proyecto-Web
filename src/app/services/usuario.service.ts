import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRequest } from '../models/usuario.model';
import { API_ENDPOINTS } from './api.config';
 
export interface LoginRequest {
  correo: string;
  contrasena: string;
}
 
export interface CrearUsuarioRequest extends UsuarioRequest {
  // Extiende UsuarioRequest — ajusta si el backend espera campos extra al crear
}
 
export interface EmailInvitacionRequest {
  to: string;
  subject: string;
  message: string;
}


export interface InvitarUsuarioRequest {   
  correo: string;
  rol: string;
  empresaId: number;
}
 
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 
  private readonly url = API_ENDPOINTS.usuarios;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/usuarios */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }
 
  /** GET /api/usuarios/empresa/:empresaId */
  listarPorEmpresa(empresaId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/empresa/${empresaId}`);
  }
 
  /** GET /api/usuarios/:id */
  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }
 
  /** POST /api/usuarios */
  crear(dto: CrearUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, dto);
  }
 
  /** POST /api/usuarios/login */
  login(dto: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, dto);
  }
 
  /** PUT /api/usuarios/:id */
  actualizar(id: number, dto: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/usuarios/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  /** POST /api/usuarios/enviar-invitacion */
  enviarInvitacion(dto: EmailInvitacionRequest): Observable<string> {
    return this.http.post(`${this.url}/enviar-invitacion`, dto, { responseType: 'text' });
  }

  /** POST /api/usuarios/invitar */
  invitar(dto: InvitarUsuarioRequest): Observable<Usuario> {   // ← NUEVO
    return this.http.post<Usuario>(`${this.url}/invitar`, dto);
  }
}
