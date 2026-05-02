import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso, EstadoProceso } from '../../models/proceso.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-procesos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor-procesos.html',
  styleUrl: './gestor-procesos.css'
})
export class GestorProcesos implements OnInit {
  procesos: Proceso[] = [];
  procesosFiltrados: Proceso[] = [];
  empresaId: number = 0;
  
  filtrosForm: FormGroup;
  categoriasDisponibles: string[] = [];
  estadosDisponibles: EstadoProceso[] = ['BORRADOR', 'PUBLICADO', 'INACTIVO'];

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.filtrosForm = this.fb.group({
      busqueda: [''],
      categoria: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    const idStored = localStorage.getItem('empresaId');
    if (idStored) {
      this.empresaId = parseInt(idStored);
      this.cargarProcesos();
    }
    this.filtrosForm.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  cargarProcesos(): void {
    this.procesoService.listarPorEmpresa(this.empresaId).subscribe({
      next: (data) => {
        this.procesos = data;
        this.extraerCategorias(data);
        this.aplicarFiltros();
        this.cdr.detectChanges(); 
      }
    });
  }

  extraerCategorias(data: Proceso[]): void {
    const cats = data.map(p => p.categoria).filter(c => c && c.trim() !== '');
    this.categoriasDisponibles = [...new Set(cats)];
  }

  aplicarFiltros(): void {
    const { busqueda, categoria, estado } = this.filtrosForm.value;
    this.procesosFiltrados = this.procesos.filter(p => {
      const matchNombre = p.nombre.toLowerCase().includes((busqueda || '').toLowerCase());
      const matchCategoria = categoria ? p.categoria === categoria : true;
      const matchEstado = estado ? p.estado === estado : true;
      return matchNombre && matchCategoria && matchEstado;
    });
    this.cdr.detectChanges();
  }

  volver() { this.router.navigate(['/dashboard-general']); }
  verDetalle(id: number) { this.router.navigate(['/modelador-proceso', id]); }
  editarProceso(id: number) { this.router.navigate(['/formulario-proceso', id]); }
  agregarProceso() { this.router.navigate(['/formulario-proceso']); }

  eliminarProceso(proceso: Proceso): void {
    if (confirm(`¿Eliminar proceso "${proceso.nombre}"?`)) {
      this.procesoService.eliminar(proceso.id).subscribe({
        next: () => this.cargarProcesos(),
        error: () => this.cargarProcesos()
      });
    }
  }
}