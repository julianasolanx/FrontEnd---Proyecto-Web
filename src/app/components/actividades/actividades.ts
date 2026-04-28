import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../services/actividad.service';
import { RolProcesoService } from '../../services/rol-proceso.service';
import { Actividad, CrearActividad } from '../../models/actividad.model';
import { RolProceso } from '../../models/rol-proceso.model';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class ActividadesComponent implements OnInit, OnChanges {
  @Input() procesoId!: number;
  @Input() empresaId!: number;

  actividades: Actividad[] = [];
  roles: RolProceso[] = [];
  cargando = true;
  mostrarForm = false;
  editando: Actividad | null = null;
  error = '';

  form: CrearActividad = {
    nombre: '',
    descripcion: '',
    tipo: 'TAREA',
    procesoId: 0
  };

  constructor(
    private actividadService: ActividadService,
    private rolService: RolProcesoService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.cargarRoles();
  }

  ngOnChanges(): void {
    if (this.procesoId) this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.actividadService.getPorProceso(this.procesoId).subscribe({
      next: (data) => { this.actividades = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarRoles(): void {
    const op$ = this.empresaId
      ? this.rolService.getPorEmpresa(this.empresaId)
      : this.rolService.getRoles();
    op$.subscribe({ next: (r) => this.roles = r, error: () => {} });
  }

  abrirNuevo(): void {
    this.editando = null;
    this.form = { nombre: '', descripcion: '', tipo: 'TAREA', procesoId: this.procesoId };
    this.error = '';
    this.mostrarForm = true;
  }

  abrirEditar(a: Actividad): void {
    this.editando = a;
    this.form = {
      nombre: a.nombre,
      descripcion: a.descripcion,
      tipo: a.tipo,
      procesoId: a.procesoId,
      rolResponsableId: a.rolResponsableId
    };
    this.error = '';
    this.mostrarForm = true;
  }

  guardar(): void {
    if (!this.form.nombre.trim()) { this.error = 'El nombre es requerido.'; return; }

    const op$ = this.editando
      ? this.actividadService.actualizar(this.editando.id, this.form)
      : this.actividadService.crear({ ...this.form, procesoId: this.procesoId });

    op$.subscribe({
      next: () => { this.mostrarForm = false; this.cargar(); },
      error: (e) => { this.error = e.error?.message || 'Error al guardar.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta actividad?')) return;
    this.actividadService.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar la actividad.')
    });
  }

  cancelar(): void {
    this.mostrarForm = false;
    this.error = '';
  }

  getNombreRol(rolId?: number): string {
    if (!rolId) return '—';
    return this.roles.find(r => r.id === rolId)?.nombre ?? `Rol ${rolId}`;
  }

  getTipoBadge(tipo: string): string {
    const map: Record<string, string> = {
      INICIO: 'badge-inicio',
      TAREA: 'badge-tarea',
      DECISION: 'badge-decision',
      FIN: 'badge-fin'
    };
    return map[tipo] ?? 'badge-tarea';
  }
}
