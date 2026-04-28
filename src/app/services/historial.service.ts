import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialCambio } from '../models/historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private apiUrl = '/api/historial';

  constructor(private http: HttpClient) {}

  getPorProceso(procesoId: number): Observable<HistorialCambio[]> {
    return this.http.get<HistorialCambio[]>(`${this.apiUrl}/proceso/${procesoId}`);
  }
}
