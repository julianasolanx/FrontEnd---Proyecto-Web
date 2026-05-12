import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoolService } from '../../services/pool.service';
import { LaneService } from '../../services/lane.service';
import { Pool } from '../../models/pool.model';
import { Lane } from '../../models/lane.model';

@Component({
  selector: 'app-gestor-pool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-pool.html',
  styleUrl: './gestor-pool.css',
})
export class GestorPool implements OnInit {
  pool: Pool | null = null;
  lanes: Lane[] = [];
  empresaId = 0;
  cargando = false;
  guardando = false;
  sinPool = false;

  editandoPool = false;
  poolForm = { nombre: '', descripcion: '' };

  showModalLane = false;
  editandoLane = false;
  laneSeleccionada: Lane | null = null;
  laneForm = { nombre: '', descripcion: '' };

  constructor(
    private poolService: PoolService,
    private laneService: LaneService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.empresaId = parseInt(localStorage.getItem('empresaId') || '0');
    if (this.empresaId) this.cargarPool();
  }

  cargarPool(): void {
    this.cargando = true;
    this.sinPool = false;
    this.poolService.obtenerPorEmpresa(this.empresaId).subscribe({
      next: (pool) => {
        this.pool = pool;
        this.cargando = false;
        this.cdr.detectChanges();
        this.cargarLanes();
      },
      error: (err) => {
        this.cargando = false;
        this.sinPool = err.status === 404;
        this.cdr.detectChanges();
      },
    });
  }

  crearPoolInicial(): void {
    if (this.guardando) return;
    this.guardando = true;
    this.poolService.crear({ nombre: 'Pool principal', descripcion: '', empresaId: this.empresaId }).subscribe({
      next: (pool) => {
        this.pool = pool;
        this.sinPool = false;
        this.guardando = false;
        this.cdr.detectChanges();
        this.cargarLanes();
      },
      error: () => { this.guardando = false; this.cdr.detectChanges(); },
    });
  }

  cargarLanes(): void {
    this.laneService.listarPorEmpresa(this.empresaId).subscribe({
      next: (lanes) => { this.lanes = lanes; this.cdr.detectChanges(); },
      error: () => { this.lanes = []; this.cdr.detectChanges(); },
    });
  }

  editarPool(): void {
    if (!this.pool) return;
    this.poolForm = { nombre: this.pool.nombre, descripcion: this.pool.descripcion || '' };
    this.editandoPool = true;
  }

  guardarPool(): void {
    if (!this.pool || this.guardando) return;
    this.guardando = true;
    this.poolService.actualizar(this.pool.id, { ...this.poolForm, empresaId: this.empresaId }).subscribe({
      next: (p) => { this.pool = p; this.editandoPool = false; this.guardando = false; },
      error: () => { this.guardando = false; },
    });
  }

  abrirModalNuevaLane(): void {
    this.laneSeleccionada = null;
    this.editandoLane = false;
    this.laneForm = { nombre: '', descripcion: '' };
    this.showModalLane = true;
  }

  abrirModalEditarLane(lane: Lane): void {
    this.laneSeleccionada = lane;
    this.editandoLane = true;
    this.laneForm = { nombre: lane.nombre, descripcion: lane.descripcion || '' };
    this.showModalLane = true;
  }

  guardarLane(): void {
    if (!this.laneForm.nombre.trim() || this.guardando || !this.pool) return;
    this.guardando = true;

    const req = { ...this.laneForm, poolId: this.pool.id };

    const op$ = this.editandoLane && this.laneSeleccionada
      ? this.laneService.actualizar(this.laneSeleccionada.id, req)
      : this.laneService.crear(req);

    op$.subscribe({
      next: () => { this.showModalLane = false; this.guardando = false; this.cargarLanes(); },
      error: () => { this.guardando = false; },
    });
  }

  eliminarLane(lane: Lane): void {
    if (!confirm(`¿Eliminar la lane "${lane.nombre}"?`)) return;
    this.laneService.eliminar(lane.id).subscribe({ next: () => this.cargarLanes() });
  }

  volver(): void {
    this.router.navigate(['/dashboard-general']);
  }
}
