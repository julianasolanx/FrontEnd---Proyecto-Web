import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.model';
import { Usuario } from '../../models/usuario.model';
import { ActividadesComponent } from '../../components/actividades/actividades';
import { HistorialComponent } from '../../components/historial/historial';
import { ProcesoEditorComponent } from '../../components/proceso-editor/proceso-editor';

@Component({
  selector: 'app-proceso-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, ActividadesComponent, HistorialComponent, ProcesoEditorComponent],
  templateUrl: './proceso-detalle.html',
  styleUrl: './proceso-detalle.css'
})
export class ProcesoDetalleComponent implements OnInit {
  proceso: Proceso | null = null;
  usuario: Usuario | null = null;
  cargando = true;
  modoEdicion = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private procesoService: ProcesoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) { this.router.navigate(['/login']); return; }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.procesoService.getProceso(id).subscribe({
      next: (p) => { this.proceso = p; this.cargando = false; },
      error: () => { this.cargando = false; this.router.navigate(['/home']); }
    });
  }

  onGuardado(p: Proceso): void {
    this.proceso = p;
    this.modoEdicion = false;
  }

  eliminar(): void {
    if (!this.proceso || !confirm('¿Eliminar este proceso permanentemente?')) return;
    this.procesoService.eliminarProceso(this.proceso.id).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (e) => alert(e.error?.message || 'No se pudo eliminar el proceso.')
    });
  }
}
