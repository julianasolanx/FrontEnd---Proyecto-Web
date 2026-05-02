import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Arco, ArcoRequest } from '../models/arco.model';
import { API_ENDPOINTS } from './api.config';
 
@Injectable({
  providedIn: 'root'
})
export class ArcoService {
 
  private readonly url = API_ENDPOINTS.arco;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/arcos */
  listar(): Observable<Arco[]> {
    return this.http.get<Arco[]>(this.url);
  }
 
  /** GET /api/arcos/proceso/:procesoId */
  listarPorProceso(procesoId: number): Observable<Arco[]> {
    return this.http.get<Arco[]>(`${this.url}/proceso/${procesoId}`);
  }
 
  /** GET /api/arcos/:id */
  obtener(id: number): Observable<Arco> {
    return this.http.get<Arco>(`${this.url}/${id}`);
  }
 
  /** POST /api/arcos */
  crear(dto: ArcoRequest): Observable<Arco> {
    return this.http.post<Arco>(this.url, dto);
  }
 
  /** PUT /api/arcos/:id */
  actualizar(id: number, dto: ArcoRequest): Observable<Arco> {
    return this.http.put<Arco>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/arcos/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}