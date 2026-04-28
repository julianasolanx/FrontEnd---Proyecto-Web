import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proceso } from '../models/proceso.model';

@Injectable({ providedIn: 'root' })
export class ProcesoService {
  private apiUrl = '/api/procesos';

  constructor(private http: HttpClient) {}

  getProcesos(): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.apiUrl);
  }

  getProcesosPorEmpresa(empresaId: number): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(`${this.apiUrl}/empresa/${empresaId}`);
  }

  getProceso(id: number): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.apiUrl}/${id}`);
  }

  crearProceso(dto: Partial<Proceso>): Observable<Proceso> {
    return this.http.post<Proceso>(this.apiUrl, dto);
  }

  actualizarProceso(id: number, dto: Partial<Proceso>): Observable<Proceso> {
    return this.http.put<Proceso>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarProceso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
