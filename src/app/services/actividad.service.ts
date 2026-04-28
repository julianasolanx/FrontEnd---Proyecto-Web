import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad, CrearActividad } from '../models/actividad.model';

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private apiUrl = '/api/actividades';

  constructor(private http: HttpClient) {}

  getPorProceso(procesoId: number): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/proceso/${procesoId}`);
  }

  crear(dto: CrearActividad): Observable<Actividad> {
    return this.http.post<Actividad>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: Partial<CrearActividad>): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
