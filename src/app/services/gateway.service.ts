import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gateway, GatewayRequest } from '../models/gateway.model';
import { API_ENDPOINTS } from './api.config';
 
@Injectable({
  providedIn: 'root'
})
export class GatewayService {
 
  private readonly url = API_ENDPOINTS.gateways;
 
  constructor(private http: HttpClient) {}
 
  /** GET /api/gateways */
  listar(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(this.url);
  }
 
  /** GET /api/gateways/proceso/:procesoId */
  listarPorProceso(procesoId: number): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(`${this.url}/proceso/${procesoId}`);
  }
 
  /** GET /api/gateways/:id */
  obtener(id: number): Observable<Gateway> {
    return this.http.get<Gateway>(`${this.url}/${id}`);
  }
 
  /** POST /api/gateways */
  crear(dto: GatewayRequest): Observable<Gateway> {
    return this.http.post<Gateway>(this.url, dto);
  }
 
  /** PUT /api/gateways/:id */
  actualizar(id: number, dto: GatewayRequest): Observable<Gateway> {
    return this.http.put<Gateway>(`${this.url}/${id}`, dto);
  }
 
  /** DELETE /api/gateways/:id */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}