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
 
 
  listar(): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(this.url);
  }
 
  
  listarPorEmpresa(empresaId: number): Observable<RolProceso[]> {
    return this.http.get<RolProceso[]>(`${this.url}/empresa/${empresaId}`);
  }
 
 
  obtener(id: number): Observable<RolProceso> {
    return this.http.get<RolProceso>(`${this.url}/${id}`);
  }
 
 
  crear(dto: RolProcesoRequest): Observable<RolProceso> {
    return this.http.post<RolProceso>(this.url, dto);
  }
 
 
  actualizar(id: number, dto: RolProcesoRequest): Observable<RolProceso> {
    return this.http.put<RolProceso>(`${this.url}/${id}`, dto);
  }
 
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}