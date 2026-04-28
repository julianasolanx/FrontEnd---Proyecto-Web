import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../services/historial.service';
import { HistorialCambio } from '../../models/historial.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class HistorialComponent implements OnInit, OnChanges {
  @Input() procesoId!: number;

  historial: HistorialCambio[] = [];
  cargando = true;

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void { this.cargar(); }

  ngOnChanges(): void {
    if (this.procesoId) this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.historialService.getPorProceso(this.procesoId).subscribe({
      next: (data) => { this.historial = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }
}
