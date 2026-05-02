import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolProcesoService } from '../../services/rolproceso.service';
import { ProcesoService } from '../../services/proceso.service';
import { RolProceso, RolProcesoRequest } from '../../models/rolproceso.model';
import { Proceso } from '../../models/proceso.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor-roles.html',
  styleUrl: './gestor-roles.css'
})
export class GestorRoles implements OnInit {
  roles: RolProceso[] = [];
  rolesFiltrados: RolProceso[] = [];
  procesosDelRol: Proceso[] = [];
  
  rolEnPanelIzquierdo: RolProceso | null = null;
  rolEnModalDetalle: RolProceso | null = null;

  panelIzquierdoForm: FormGroup;
  crearRolForm: FormGroup;

  modoEdicionIzquierda: boolean = false;
  modoEdicionModal: boolean = false; 
  mostrarModalCrear: boolean = false;
  mostrarModalDetalle: boolean = false;
  guardandoRol: boolean = false;
  empresaId: number = 0;
  
  // VARIABLE CRÍTICA PARA EL LECTOR
  rolActual: string | null = ''; 
  
  descripcionTemporalModal: string = '';

  constructor(
    private fb: FormBuilder,
    private rolService: RolProcesoService,
    private procesoService: ProcesoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.panelIzquierdoForm = this.fb.group({
      nombreBusqueda: [''],
      descripcionBusqueda: [{ value: '', disabled: true }, Validators.required]
    });

    this.crearRolForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtenemos el rol del usuario al cargar el componente
    this.rolActual = localStorage.getItem('rol'); 
    
    const idStored = localStorage.getItem('empresaId');
    if (idStored) {
      this.empresaId = parseInt(idStored);
      this.cargarRoles();
    }
  }

  cargarRoles(): void {
    this.rolService.listarPorEmpresa(this.empresaId).subscribe({
      next: (data) => {
        this.roles = data;
        this.ejecutarBusqueda(); 
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    const rol = localStorage.getItem('rol'); 

    if (rol === 'LECTOR') {
      this.router.navigate(['/consultar-procesos']);
    } else if (rol === 'EDITOR') {
      this.router.navigate(['/editar-procesos']);
    } else {
      this.router.navigate(['/dashboard-general']);
    }
  }

  // --- PANEL IZQUIERDO ---
  ejecutarBusqueda(): void {
    const term = this.panelIzquierdoForm.get('nombreBusqueda')?.value.toLowerCase().trim();
    
    if (!term) {
      this.rolesFiltrados = [...this.roles]; 
      this.rolEnPanelIzquierdo = null;
      this.panelIzquierdoForm.patchValue({ descripcionBusqueda: '' });
      this.modoEdicionIzquierda = false;
      this.panelIzquierdoForm.get('descripcionBusqueda')?.disable();
    } else {
      this.rolesFiltrados = this.roles.filter(r => r.nombre.toLowerCase().includes(term));
      const exacto = this.rolesFiltrados.find(r => r.nombre.toLowerCase() === term);
      
      if (exacto) {
        this.rolEnPanelIzquierdo = exacto;
        this.panelIzquierdoForm.patchValue({ descripcionBusqueda: exacto.descripcion });
        this.modoEdicionIzquierda = false;
        
        // Bloqueo adicional por código: si es LECTOR nunca habilitamos el campo
        if (this.rolActual !== 'LECTOR') {
            this.panelIzquierdoForm.get('descripcionBusqueda')?.disable();
        }
      } else {
        this.rolEnPanelIzquierdo = null;
        this.panelIzquierdoForm.patchValue({ descripcionBusqueda: '' });
      }
    }
    this.cdr.detectChanges();
  }

  activarEdicionIzquierda(): void {
    // Solo permitimos habilitar edición si no es lector
    if (this.rolEnPanelIzquierdo && this.rolActual !== 'LECTOR') {
      this.modoEdicionIzquierda = true;
      this.panelIzquierdoForm.get('descripcionBusqueda')?.enable();
    }
  }

  cancelarEdicionIzquierda(): void {
    this.modoEdicionIzquierda = false;
    this.panelIzquierdoForm.get('descripcionBusqueda')?.disable();
    if (this.rolEnPanelIzquierdo) {
      this.panelIzquierdoForm.patchValue({ descripcionBusqueda: this.rolEnPanelIzquierdo.descripcion });
    }
  }

  guardarEdicionIzquierda(): void {
    if (this.rolEnPanelIzquierdo && this.panelIzquierdoForm.valid && this.rolActual !== 'LECTOR') {
      const dto: RolProcesoRequest = {
        nombre: this.rolEnPanelIzquierdo.nombre,
        descripcion: this.panelIzquierdoForm.get('descripcionBusqueda')?.value,
        empresaId: this.empresaId
      };

      this.rolService.actualizar(this.rolEnPanelIzquierdo.id, dto).subscribe(() => {
        this.modoEdicionIzquierda = false;
        this.panelIzquierdoForm.get('descripcionBusqueda')?.disable();
        this.cargarRoles();
      });
    }
  }

  // --- MODAL CREAR ---
  abrirModalCrear(): void {
    if (this.rolActual === 'LECTOR') return; // Seguridad extra
    this.crearRolForm.reset();
    this.mostrarModalCrear = true;
    this.cdr.detectChanges(); 
  }

  guardarNuevoRol(): void {
    if (this.crearRolForm.invalid || this.guardandoRol || this.rolActual === 'LECTOR') return;
    this.guardandoRol = true;

    const dto: RolProcesoRequest = {
      nombre: this.crearRolForm.value.nombre,
      descripcion: this.crearRolForm.value.descripcion,
      empresaId: this.empresaId
    };

    this.mostrarModalCrear = false;

    this.rolService.crear(dto).subscribe({
      next: () => {
        this.crearRolForm.reset();
        this.guardandoRol = false;
        this.cargarRoles(); 
      },
      error: () => {
        this.crearRolForm.reset();
        this.guardandoRol = false;
        this.cargarRoles(); 
      }
    });
  }

  // --- MODAL DETALLE Y ELIMINAR ---
  abrirModalDetalle(rol: RolProceso): void {
    this.rolEnModalDetalle = rol;
    this.mostrarModalDetalle = true;
    this.modoEdicionModal = false;
    
    this.procesoService.listarPorEmpresa(this.empresaId).subscribe(procesos => {
      this.procesosDelRol = procesos.filter(p => 
        p.actividades?.some(a => a.rolResponsable?.id === rol.id)
      );
      this.cdr.detectChanges(); 
    });
    this.cdr.detectChanges();
  }

  activarEdicionModal(): void {
    if (this.rolActual !== 'LECTOR') {
        this.modoEdicionModal = true;
        this.descripcionTemporalModal = this.rolEnModalDetalle?.descripcion || '';
        this.cdr.detectChanges();
    }
  }

  guardarEdicionModal(): void {
    if (this.rolEnModalDetalle && this.descripcionTemporalModal.trim() !== '' && this.rolActual !== 'LECTOR') {
      const dto: RolProcesoRequest = {
        nombre: this.rolEnModalDetalle.nombre,
        descripcion: this.descripcionTemporalModal,
        empresaId: this.empresaId
      };

      this.rolService.actualizar(this.rolEnModalDetalle.id, dto).subscribe(() => {
        this.mostrarModalDetalle = false;
        this.cargarRoles();
      });
    }
  }

  ejecutarEliminacion(rol: RolProceso | null): void {
    if (!rol || this.rolActual === 'LECTOR') return;

    if (confirm(`¿Eliminar definitivamente el rol "${rol.nombre}"?`)) {
      this.mostrarModalDetalle = false;
      if (this.rolEnPanelIzquierdo?.id === rol.id) {
        this.rolEnPanelIzquierdo = null;
        this.panelIzquierdoForm.reset();
        this.panelIzquierdoForm.get('descripcionBusqueda')?.disable();
        this.modoEdicionIzquierda = false;
      }

      this.roles = this.roles.filter(r => r.id !== rol.id);
      this.ejecutarBusqueda();

      this.rolService.eliminar(rol.id).subscribe({
        next: () => { this.cargarRoles(); },
        error: () => { this.cargarRoles(); }
      });
    }
  }
}