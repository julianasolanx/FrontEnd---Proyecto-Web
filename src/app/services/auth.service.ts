import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  correo: string;
  rol: string;
  id: number;
  nombre: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly authUrl = '/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    const body: LoginRequest = { username: correo, password: contrasena };
    return this.http.post<LoginResponse>(this.authUrl, body).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify({
          id: response.id,
          correo: response.correo,
          nombre: response.nombre,
          rol: response.rol,
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('empresaId');
    localStorage.removeItem('usuarioRol');
    this.router.navigate(['/log-in']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): { id: number; correo: string; nombre: string; rol: string } | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getUserRol(): string | null {
    return this.getCurrentUser()?.rol ?? null;
  }
}
