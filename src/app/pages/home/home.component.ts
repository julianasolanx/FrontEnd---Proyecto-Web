import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProcesoService } from '../../services/proceso.service';
import { Usuario } from '../../models/usuario.model';
import { Proceso } from '../../models/proceso.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuario: Usuario | null = null;
  procesos: Proceso[] = [];
  procesosFiltrados: Proceso[] = [];
  busqueda = '';
  filtroEstado = '';
  cargando = true;
  errorConexion = '';

  readonly paletas = ['cream', 'amber', 'pink', 'blue'];

  constructor(
    private authService: AuthService,
    private procesoService: ProcesoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.cargando = true;
    const source$ = this.usuario?.empresaId
      ? this.procesoService.getProcesosPorEmpresa(this.usuario.empresaId)
      : this.procesoService.getProcesos();

    source$.subscribe({
      next: (data) => {
        this.procesos = data;
        this.procesosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        this.errorConexion = 'No se pudo conectar con el servidor.';
        this.cargando = false;
      }
    });
  }

  filtrar(): void {
    this.procesosFiltrados = this.procesos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = !this.filtroEstado || p.estado === this.filtroEstado;
      return coincideNombre && coincideEstado;
    });
  }

  get totalPublicados(): number {
    return this.procesos.filter(p => p.estado === 'PUBLICADO').length;
  }

  get totalBorradores(): number {
    return this.procesos.filter(p => p.estado === 'BORRADOR').length;
  }

  get totalInactivos(): number {
    return this.procesos.filter(p => p.estado === 'INACTIVO').length;
  }

  getPaleta(index: number): string {
    return this.paletas[index % this.paletas.length];
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
