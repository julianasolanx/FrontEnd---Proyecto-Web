import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';
import { Lane, LaneRequest } from '../models/lane.model';

@Injectable({ providedIn: 'root' })
export class LaneService {
  private url = `${API_BASE}/lanes`;

  constructor(private http: HttpClient) {}

  listarPorEmpresa(empresaId: number): Observable<Lane[]> {
    return this.http.get<Lane[]>(`${this.url}/empresa/${empresaId}`);
  }

  listarPorPool(poolId: number): Observable<Lane[]> {
    return this.http.get<Lane[]>(`${this.url}/pool/${poolId}`);
  }

  crear(req: LaneRequest): Observable<Lane> {
    return this.http.post<Lane>(this.url, req);
  }

  actualizar(id: number, req: Partial<LaneRequest>): Observable<Lane> {
    return this.http.put<Lane>(`${this.url}/${id}`, req);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
