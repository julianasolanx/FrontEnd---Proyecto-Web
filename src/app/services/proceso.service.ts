// Coloca este archivo en: src/app/core/services/proceso.service.ts
 
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoProceso, Proceso, ProcesoRequest } from '../models/proceso.model';
import { API_ENDPOINTS } from './api.config';
 
export interface ProcesoFiltros {
  estado?: EstadoProceso;
  categoria?: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
 
  private readonly url = API_ENDPOINTS.procesos;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/procesos */
  listar(): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.url);
  }
 
  /** GET /api/procesos/empresa/:empresaId */
  listarPorEmpresa(empresaId: number): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(`${this.url}/empresa/${empresaId}`);
  }
 
  /** GET /api/procesos/empresa/:empresaId/filtrar?estado=&categoria= */
  filtrar(empresaId: number, filtros: ProcesoFiltros = {}): Observable<Proceso[]> {
    let params = new HttpParams();
    if (filtros.estado)    params = params.set('estado', filtros.estado);
    if (filtros.categoria) params = params.set('categoria', filtros.categoria);
    return this.http.get<Proceso[]>(`${this.url}/empresa/${empresaId}/filtrar`, { params });
  }
 
  /** GET /api/procesos/:id */
  obtener(id: number): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.url}/${id}`);
  }
 
  /** POST /api/procesos */
  crear(dto: ProcesoRequest): Observable<Proceso> {
    return this.http.post<Proceso>(this.url, dto);
  }
 
  /** PUT /api/procesos/:id */
  actualizar(id: number, dto: ProcesoRequest): Observable<Proceso> {
    return this.http.put<Proceso>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/procesos/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}