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
 
  
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }
 
  
  listarPorEmpresa(empresaId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/empresa/${empresaId}`);
  }
 
  
  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }
 
 
  crear(dto: CrearUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, dto);
  }
 
 
  login(dto: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, dto);
  }
 
  
  actualizar(id: number, dto: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, dto);
  }
 
 
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  
  enviarInvitacion(dto: EmailInvitacionRequest): Observable<string> {
    return this.http.post(`${this.url}/enviar-invitacion`, dto, { responseType: 'text' });
  }


  invitar(dto: InvitarUsuarioRequest): Observable<Usuario> {   
    return this.http.post<Usuario>(`${this.url}/invitar`, dto);
  }
}
