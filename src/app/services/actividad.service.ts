import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad, CrearActividad } from '../models/actividad.model';
import { API_ENDPOINTS } from './api.config';
 
@Injectable({
  providedIn: 'root'
})
export class ActividadService {
 
  private readonly url = API_ENDPOINTS.actividades;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/actividades */
  listar(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.url);
  }
 
  /** GET /api/actividades/proceso/:procesoId */
  listarPorProceso(procesoId: number): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.url}/proceso/${procesoId}`);
  }
 
  /** GET /api/actividades/:id */
  obtener(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.url}/${id}`);
  }
 
  /** POST /api/actividades */
  crear(dto: CrearActividad): Observable<Actividad> {
    return this.http.post<Actividad>(this.url, dto);
  }
 
  /** PUT /api/actividades/:id */
  actualizar(id: number, dto: CrearActividad): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/actividades/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}