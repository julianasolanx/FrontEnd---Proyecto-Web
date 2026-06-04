import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '../../services/mensaje.service';
import { EventoMensaje, MensajeProceso, ReglaCorrelacion } from '../../models/mensaje.model';

@Component({
  selector: 'app-gestor-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-mensajes.html',
  styleUrl: './gestor-mensajes.css',
})
export class GestorMensajes implements OnInit {
  procesoId = 0;
  mensajes: MensajeProceso[] = [];
  eventos: EventoMensaje[] = [];
  reglas: ReglaCorrelacion[] = [];

  tabActivo: 'mensajes' | 'eventos' | 'reglas' = 'mensajes';
  cargando = false;
  guardando = false;

  showModalMensaje = false;
  editandoMensaje = false;
  mensajeSeleccionado: MensajeProceso | null = null;
  mensajeForm = { nombre: '', tipo: 'THROW' as 'THROW' | 'CATCH', payloadTemplate: '', businessKey: '' };

  showModalLanzar = false;
  lanzarForm = { payload: '', businessKey: '' };

  showModalRegla = false;
  reglaForm = {
    nombreMensaje: '',
    tipoCorrelacion: 'BUSINESS_KEY' as 'BUSINESS_KEY' | 'VARIABLE' | 'EXPRESION',
    valorCorrelacion: '',
    politicaMultiple: 'PRIMERA' as 'ERROR' | 'PRIMERA' | 'NUEVA_INSTANCIA',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mensajeService: MensajeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('procesoId');
    if (id) {
      this.procesoId = parseInt(id);
      this.cargarTodo();
    }
  }

  cargarTodo(): void {
    this.cargando = true;
    this.mensajeService.listarPorProceso(this.procesoId).subscribe(m => { this.mensajes = m; this.cargando = false; });
    this.mensajeService.listarEventos(this.procesoId).subscribe(e => (this.eventos = e));
    this.mensajeService.listarReglas(this.procesoId).subscribe(r => (this.reglas = r));
  }

  // ─── MENSAJES ────────────────────────────────────────────────────────────

  abrirNuevoMensaje(): void {
    this.editandoMensaje = false;
    this.mensajeSeleccionado = null;
    this.mensajeForm = { nombre: '', tipo: 'THROW', payloadTemplate: '', businessKey: '' };
    this.showModalMensaje = true;
  }

  abrirEditarMensaje(m: MensajeProceso): void {
    this.editandoMensaje = true;
    this.mensajeSeleccionado = m;
    this.mensajeForm = { nombre: m.nombre, tipo: m.tipo, payloadTemplate: m.payloadTemplate || '', businessKey: m.businessKey || '' };
    this.showModalMensaje = true;
  }

  guardarMensaje(): void {
    if (!this.mensajeForm.nombre.trim() || this.guardando) return;
    this.guardando = true;
    const req = { ...this.mensajeForm, procesoId: this.procesoId };
    const op$ = this.editandoMensaje && this.mensajeSeleccionado
      ? this.mensajeService.actualizar(this.mensajeSeleccionado.id, req)
      : this.mensajeService.crear(req);
    op$.subscribe({
      next: () => { this.showModalMensaje = false; this.guardando = false; this.cargarTodo(); },
      error: () => { this.guardando = false; },
    });
  }

  eliminarMensaje(m: MensajeProceso): void {
    if (!confirm(`¿Eliminar el mensaje "${m.nombre}"?`)) return;
    this.mensajeService.eliminar(m.id).subscribe({ next: () => this.cargarTodo() });
  }

  // ─── THROW (HU-25) ───────────────────────────────────────────────────────

  abrirLanzar(m: MensajeProceso): void {
    this.mensajeSeleccionado = m;
    this.lanzarForm = { payload: m.payloadTemplate || '{}', businessKey: m.businessKey || '' };
    this.showModalLanzar = true;
  }

  lanzarMensaje(): void {
    if (!this.mensajeSeleccionado || this.guardando) return;
    this.guardando = true;
    this.mensajeService.lanzar(this.mensajeSeleccionado.id, this.lanzarForm.payload, this.lanzarForm.businessKey).subscribe({
      next: (evento) => {
        this.showModalLanzar = false;
        this.guardando = false;
        this.cargarTodo();
        this.tabActivo = 'eventos';
        alert(`Mensaje ${evento.estado === 'ENTREGADO' ? 'entregado al proceso receptor ✓' : 'enviado — estado: ' + evento.estado}`);
      },
      error: () => { this.guardando = false; },
    });
  }

  // ─── REGLAS (HU-28) ──────────────────────────────────────────────────────

  abrirNuevaRegla(): void {
    this.reglaForm = { nombreMensaje: '', tipoCorrelacion: 'BUSINESS_KEY', valorCorrelacion: '', politicaMultiple: 'PRIMERA' };
    this.showModalRegla = true;
  }

  guardarRegla(): void {
    if (!this.reglaForm.nombreMensaje.trim() || this.guardando) return;
    this.guardando = true;
    this.mensajeService.crearRegla({ ...this.reglaForm, procesoId: this.procesoId }).subscribe({
      next: () => { this.showModalRegla = false; this.guardando = false; this.cargarTodo(); },
      error: () => { this.guardando = false; },
    });
  }

  eliminarRegla(r: ReglaCorrelacion): void {
    if (!confirm(`¿Eliminar la regla para "${r.nombreMensaje}"?`)) return;
    this.mensajeService.eliminarRegla(r.id).subscribe({ next: () => this.cargarTodo() });
  }

  estadoClass(estado: string): string {
    return { ENTREGADO: 'badge-green', PENDIENTE: 'badge-yellow', ERROR: 'badge-red', NO_CORRELACIONADO: 'badge-gray' }[estado] || '';
  }

  volver(): void {
    this.router.navigate(['/gestor-procesos']);
  }
}
