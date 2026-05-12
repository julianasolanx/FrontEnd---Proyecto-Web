import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesoService } from '../../services/proceso.service';
import { ProcesoRequest, EstadoProceso } from '../../models/proceso.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-proceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-proceso.html',
  styleUrl: './formulario-proceso.css'
})
export class FormularioProceso implements OnInit {
  procesoForm: FormGroup;
  empresaId: number = 0;
  procesoId: number | null = null;
  esModoEdicion: boolean = false;
  guardando: boolean = false; // Bloqueo anti-doble clic

  estadosDisponibles: EstadoProceso[] = ['BORRADOR', 'PUBLICADO', 'INACTIVO'];

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.procesoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['BORRADOR', Validators.required],
      esCompartido: [false],
    });
  }

  ngOnInit(): void {
    const idStored = localStorage.getItem('empresaId');
    if (idStored) {
      this.empresaId = parseInt(idStored);
    } else {
      alert('Error crítico: No se encontró el ID de la empresa. Inicie sesión nuevamente.');
      this.volver();
    }

    // Leemos la URL para saber si estamos en modo editar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.procesoId = parseInt(id);
        this.esModoEdicion = true;
        this.cargarDatosProceso(this.procesoId);
      }
    });
  }

  cargarDatosProceso(id: number): void {
    this.procesoService.obtener(id).subscribe({
      next: (proceso) => {
        // Llenamos el formulario con los datos recibidos de la BD
        this.procesoForm.patchValue({
          nombre: proceso.nombre,
          categoria: proceso.categoria,
          descripcion: proceso.descripcion,
          estado: proceso.estado,
          esCompartido: proceso.esCompartido ?? false,
        });
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Error al cargar los datos del proceso.');
        this.volver();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/gestor-procesos']);
  }

  guardar(): void {
    if (this.procesoForm.invalid || this.guardando || this.empresaId === 0) return;
    
    this.guardando = true;

    // Cumplimos estrictamente con la interfaz ProcesoRequest
    const dto: ProcesoRequest = {
      nombre: this.procesoForm.value.nombre,
      descripcion: this.procesoForm.value.descripcion,
      categoria: this.procesoForm.value.categoria,
      estado: this.procesoForm.value.estado,
      empresaId: this.empresaId,
      esCompartido: this.procesoForm.value.esCompartido ?? false,
    };

    if (this.esModoEdicion && this.procesoId) {
      // ACTUALIZAR
      this.procesoService.actualizar(this.procesoId, dto).subscribe({
        next: () => this.volver(),
        error: (err) => { 
          console.error(err);
          // A veces los PUT devuelven texto o 204 y Angular falla, forzamos regreso
          this.volver(); 
        }
      });
    } else {
      // CREAR
      this.procesoService.crear(dto).subscribe({
        next: () => this.volver(),
        error: (err) => { 
          console.error(err);
          this.volver();
        }
      });
    }
  }
}