import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';

@Component({
  selector: 'app-proceso-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proceso-editor.html',
  styleUrl: './proceso-editor.css'
})
export class ProcesoEditorComponent implements OnInit {
  @Input() proceso: Proceso | null = null;
  @Input() empresaId!: number;
  @Output() guardado = new EventEmitter<Proceso>();
  @Output() cancelado = new EventEmitter<void>();

  form = { nombre: '', descripcion: '', categoria: '', estado: 'BORRADOR' };
  guardando = false;
  error = '';

  constructor(private procesoService: ProcesoService) {}

  ngOnInit(): void {
    if (this.proceso) {
      this.form = {
        nombre: this.proceso.nombre,
        descripcion: this.proceso.descripcion,
        categoria: this.proceso.categoria,
        estado: this.proceso.estado
      };
    }
  }

  get esEdicion(): boolean {
    return !!this.proceso;
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es requerido.';
      return;
    }
    this.guardando = true;
    this.error = '';
    const dto: Partial<Proceso> = {
      ...this.form,
      empresaId: this.empresaId,
      estado: this.form.estado as Proceso['estado']
    };

    const op$ = this.esEdicion
      ? this.procesoService.actualizarProceso(this.proceso!.id, dto)
      : this.procesoService.crearProceso(dto);

    op$.subscribe({
      next: (p) => { this.guardando = false; this.guardado.emit(p); },
      error: (err) => {
        this.guardando = false;
        this.error = err.error?.message || 'Error al guardar el proceso.';
      }
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
