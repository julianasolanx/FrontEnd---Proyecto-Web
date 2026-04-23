import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, Usuario, CrearUsuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials).pipe(
      tap(usuario => sessionStorage.setItem('usuario', JSON.stringify(usuario)))
    );
  }

  registrar(datos: CrearUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, datos);
  }

  getUsuario(): Usuario | null {
    const data = sessionStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('usuario');
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
  }
}
