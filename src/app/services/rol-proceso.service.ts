import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolProceso } from '../models/rol-proceso.model';

@Injectable({ providedIn: 'root' })
export class RolProcesoService {
  private apiUrl = '/api/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(this.apiUrl);
  }

  getPorEmpresa(empresaId: number): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(`${this.apiUrl}/empresa/${empresaId}`);
  }

  crear(dto: Partial<RolProceso>): Observable<RolProceso> {
    return this.http.post<RolProceso>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: Partial<RolProceso>): Observable<RolProceso> {
    return this.http.put<RolProceso>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
