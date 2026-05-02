import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolProceso, RolProcesoRequest } from '../models/rolproceso.model';
import { API_ENDPOINTS } from './api.config';
 
@Injectable({
  providedIn: 'root'
})
export class RolProcesoService {
 
  private readonly url = API_ENDPOINTS.roles;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/roles */
  listar(): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(this.url);
  }
 
  /** GET /api/roles/empresa/:empresaId */
  listarPorEmpresa(empresaId: number): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(`${this.url}/empresa/${empresaId}`);
  }
 
  /** GET /api/roles/:id */
  obtener(id: number): Observable<RolProceso> {
    return this.http.get<RolProceso>(`${this.url}/${id}`);
  }
 
  /** POST /api/roles */
  crear(dto: RolProcesoRequest): Observable<RolProceso> {
    return this.http.post<RolProceso>(this.url, dto);
  }
 
  /** PUT /api/roles/:id */
  actualizar(id: number, dto: RolProcesoRequest): Observable<RolProceso> {
    return this.http.put<RolProceso>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/roles/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}