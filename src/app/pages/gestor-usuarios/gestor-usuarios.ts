import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  afterNextRender,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, CrearUsuarioRequest } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-gestor-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor-usuarios.html',
  styleUrl: './gestor-usuarios.css',
})
export class GestorUsuarios implements OnInit {
  invitacionForm: FormGroup;
  usuarios: Usuario[] = [];
  empresaId: number | null = null;
  cargandoFormulario: boolean = false;
  cargandoTabla: boolean = true;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.invitacionForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      rol: ['SOLO_LECTURA', Validators.required],
    });

    // SOLUCIÓN SSR: Usar afterNextRender para garantizar que se ejecute
    // SOLO en el navegador, después de que el DOM esté listo
    afterNextRender(() => {
      this.inicializarComponente();
    });
  }

  ngOnInit(): void {
    // Vacío intencionalmente - la inicialización se hace en afterNextRender
    // para evitar problemas con SSR y localStorage
  }

  /**
   * INICIALIZACIÓN - Se ejecuta solo en el navegador
   */
  private inicializarComponente(): void {
    // Verificar que estamos en el navegador (no en el servidor)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Obtener empresaId del localStorage
    const idStored = localStorage.getItem('empresaId');

    if (!idStored) {
      console.error('No hay empresaId en localStorage');
      this.cargandoTabla = false;
      this.router.navigate(['/log-in']);
      return;
    }

    this.empresaId = parseInt(idStored, 10);
    console.log('✅ empresaId cargado:', this.empresaId);

    // CARGAR LA TABLA AUTOMÁTICAMENTE
    this.cargarTabla();
  }

  /**
   * CARGA LA TABLA CON LOS USUARIOS DE LA EMPRESA
   */
  cargarTabla(): void {
    if (!this.empresaId) {
      this.cargandoTabla = false;
      return;
    }

    this.cargandoTabla = true;
    console.log('📥 Cargando usuarios de la empresa:', this.empresaId);

    this.usuarioService.listarPorEmpresa(this.empresaId).subscribe({
      next: (datos) => {
        // Ejecutar dentro de NgZone para asegurar que Angular detecte el cambio
        this.ngZone.run(() => {
          console.log('✅ Usuarios recibidos:', datos);
          this.usuarios = datos || [];
          this.cargandoTabla = false;
          // Forzar detección de cambios para actualizar la vista inmediatamente
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('❌ Error al cargar usuarios:', error);
          this.cargandoTabla = false;
          this.usuarios = [];
          this.cdr.detectChanges();
        });
      },
    });
  }

  /**
   * GENERA UNA CONTRASEÑA SEGURA ALEATORIA
   */
  generarContrasena(): string {
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const especiales = '!@#$%^&*';
    const todos = minusculas + mayusculas + numeros + especiales;

    let contrasena = '';
    contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
    contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
    contrasena += numeros[Math.floor(Math.random() * numeros.length)];

    while (contrasena.length < 10) {
      contrasena += todos[Math.floor(Math.random() * todos.length)];
    }

    return contrasena
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * INVITA A UN USUARIO - SE EJECUTA AL HACER CLICK EN "ENVIAR INVITACIÓN"
   */
  invitarUsuario(): void {
    if (!this.invitacionForm.valid || !this.empresaId) return;

    this.cargandoFormulario = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const correo = this.invitacionForm.value.correo;
    const rol = this.invitacionForm.value.rol;
    const contrasena = this.generarContrasena();
    const nombre = correo.split('@')[0];

    const usuarioData: CrearUsuarioRequest = {
      nombre,
      correo,
      contrasena,
      rol,
      empresaId: this.empresaId,
    };

    this.usuarioService.crear(usuarioData).subscribe({
      next: () => {
        this.cargandoFormulario = false;
        this.mensajeExito = `✓ Usuario ${correo} invitado. Contraseña: ${contrasena}`;
        this.invitacionForm.reset({ rol: 'SOLO_LECTURA' });

        setTimeout(() => {
          this.mensajeExito = '';
        }, 5000);

        // RECARGAR LA TABLA CON EL NUEVO USUARIO
        this.cargarTabla();
      },
      error: (err) => {
        this.cargandoFormulario = false;

        if (err.status === 409) {
          this.mensajeError = '⚠️ Este correo ya está registrado';
        } else {
          this.mensajeError = '⚠️ Error al invitar usuario';
        }

        setTimeout(() => {
          this.mensajeError = '';
        }, 5000);
      },
    });
  }

  /**
   * ELIMINA UN USUARIO DE LA TABLA
   */
  eliminarUsuario(id: number, correo: string): void {
    if (!confirm(`¿Eliminar a ${correo}?`)) return;

    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
        this.mensajeExito = `✓ ${correo} eliminado`;

        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
      },
      error: () => {
        this.mensajeError = '⚠️ Error al eliminar';
        setTimeout(() => {
          this.mensajeError = '';
        }, 3000);
      },
    });
  }

  /**
   * REGRESA AL DASHBOARD
   */
  irADashboard(): void {
    this.router.navigate(['/dashboard-general']);
  }

  getRolBadgeClass(rol: string): string {
    const mapa: any = {
      ADMINISTRADOR: 'rol-admin',
      EDITOR: 'rol-editor',
      SOLO_LECTURA: 'rol-lector',
    };
    return mapa[rol] || 'rol-default';
  }

  getStatusBadgeClass(status: number): string {
    return status === 1 ? 'status-activo' : 'status-pendiente';
  }
}
