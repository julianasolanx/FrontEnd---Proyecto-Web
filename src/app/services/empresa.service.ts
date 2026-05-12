import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa, EmpresaRequest } from '../models/empresa.model';
import { API_ENDPOINTS } from './api.config';
 
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
 
  private readonly url = API_ENDPOINTS.empresas;
 
  constructor(private http: HttpClient) {}
 
  
  listar(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.url);
  }
 
 
  obtener(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.url}/${id}`);
  }
 
  
  crear(dto: EmpresaRequest): Observable<Empresa> {
    return this.http.post<Empresa>(this.url, dto);
  }
 
 
  actualizar(id: number, dto: EmpresaRequest): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.url}/${id}`, dto);
  }
 
 
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}