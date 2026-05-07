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
 
 
  listar(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(this.url);
  }
 
  
  listarPorProceso(procesoId: number): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(`${this.url}/proceso/${procesoId}`);
  }
 
 
  obtener(id: number): Observable<Gateway> {
    return this.http.get<Gateway>(`${this.url}/${id}`);
  }
 
  
  crear(dto: GatewayRequest): Observable<Gateway> {
    return this.http.post<Gateway>(this.url, dto);
  }
 
  
  actualizar(id: number, dto: GatewayRequest): Observable<Gateway> {
    return this.http.put<Gateway>(`${this.url}/${id}`, dto);
  }
 
  
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}