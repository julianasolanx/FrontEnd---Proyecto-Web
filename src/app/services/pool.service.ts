import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api.config';
import { Pool, PoolRequest } from '../models/pool.model';

@Injectable({ providedIn: 'root' })
export class PoolService {
  private url = `${API_BASE}/pools`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pool[]> {
    return this.http.get<Pool[]>(this.url);
  }

  obtenerPorEmpresa(empresaId: number): Observable<Pool> {
    return this.http.get<Pool>(`${this.url}/empresa/${empresaId}`);
  }

  crear(req: PoolRequest): Observable<Pool> {
    return this.http.post<Pool>(this.url, req);
  }

  actualizar(id: number, req: Partial<PoolRequest>): Observable<Pool> {
    return this.http.put<Pool>(`${this.url}/${id}`, req);
  }
}
