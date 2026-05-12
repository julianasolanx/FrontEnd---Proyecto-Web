import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';
import { EventoMensaje, MensajeProceso, MensajeRequest, ProcesoAcceso, ReglaCorrelacion } from '../models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private url = `${API_BASE}/mensajes`;

  constructor(private http: HttpClient) {}

  listarPorProceso(procesoId: number): Observable<MensajeProceso[]> {
    return this.http.get<MensajeProceso[]>(`${this.url}/proceso/${procesoId}`);
  }

  crear(req: MensajeRequest): Observable<MensajeProceso> {
    return this.http.post<MensajeProceso>(this.url, req);
  }

  actualizar(id: number, req: Partial<MensajeRequest>): Observable<MensajeProceso> {
    return this.http.put<MensajeProceso>(`${this.url}/${id}`, req);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  lanzar(id: number, payload: string, businessKey: string): Observable<EventoMensaje> {
    return this.http.post<EventoMensaje>(`${this.url}/${id}/lanzar`, { payload, businessKey });
  }

  listarEventos(procesoId: number): Observable<EventoMensaje[]> {
    return this.http.get<EventoMensaje[]>(`${this.url}/eventos/proceso/${procesoId}`);
  }

  listarReglas(procesoId: number): Observable<ReglaCorrelacion[]> {
    return this.http.get<ReglaCorrelacion[]>(`${this.url}/reglas/proceso/${procesoId}`);
  }

  crearRegla(req: Partial<ReglaCorrelacion>): Observable<ReglaCorrelacion> {
    return this.http.post<ReglaCorrelacion>(`${this.url}/reglas`, req);
  }

  eliminarRegla(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/reglas/${id}`);
  }

  listarAccesosPorProceso(procesoId: number): Observable<ProcesoAcceso[]> {
    return this.http.get<ProcesoAcceso[]>(`${API_BASE}/proceso-accesos/proceso/${procesoId}`);
  }

  otorgarAcceso(req: Partial<ProcesoAcceso>): Observable<ProcesoAcceso> {
    return this.http.post<ProcesoAcceso>(`${API_BASE}/proceso-accesos`, req);
  }

  revocarAcceso(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/proceso-accesos/${id}`);
  }
}
