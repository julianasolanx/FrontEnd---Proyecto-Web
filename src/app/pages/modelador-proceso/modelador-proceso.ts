import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Edge, Node, Layout, NgxGraphZoomOptions } from '@swimlane/ngx-graph';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadService } from '../../services/actividad.service';
import { GatewayService } from '../../services/gateway.service';
import { ArcoService } from '../../services/arco.service';
import { RolProcesoService } from '../../services/rolproceso.service';
import { RolProceso } from '../../models/rolproceso.model';
import { TipoActividad } from '../../models/actividad.model';
import { TipoGateway } from '../../models/gateway.model';

@Component({
  selector: 'app-modelador-proceso',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxGraphModule],
  templateUrl: './modelador-proceso.html',
  styleUrls: ['./modelador-proceso.css'],
})
export class ModeladorProceso implements OnInit {
  nodes: Node[] = [];
  links: Edge[] = [];
  procesoId: number = 0;

  roles: RolProceso[] = [];
  activityTypes: TipoActividad[] = ['TAREA', 'SUBPROCESO', 'EVENTO_INICIO', 'EVENTO_FIN'];
  gatewayTypes: TipoGateway[] = ['EXCLUSIVO', 'PARALELO', 'INCLUSIVO'];

  layout: string | Layout = 'dagre';
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<NgxGraphZoomOptions> = new Subject<NgxGraphZoomOptions>();

  cargando = false;
  guardando = false;

  showEditModal = false;
  showAddActividadModal = false;
  showAddGatewayModal = false;

  selectedNode: Node | null = null;
  editableNode: { nombre: string; tipo: string; descripcion: string; rolResponsableId: number | undefined } = {
    nombre: '', tipo: '', descripcion: '', rolResponsableId: undefined
  };

  newActividad = { nombre: '', tipo: 'TAREA' as TipoActividad, descripcion: '', rolResponsableId: undefined as number | undefined };
  newGateway = { nombre: '', tipo: 'EXCLUSIVO' as TipoGateway };

  @ViewChild('graphRef') graphRef: any;

  linkSource: string | null = null;
  linkTarget: string | null = null;
  linkCondicion = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actividadService: ActividadService,
    private gatewayService: GatewayService,
    private arcoService: ArcoService,
    private rolService: RolProcesoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.procesoId = parseInt(id);
      this.cargarDatos();
    }
    const empresaId = parseInt(localStorage.getItem('empresaId') || '0');
    if (empresaId) {
      this.rolService.listarPorEmpresa(empresaId).subscribe(r => (this.roles = r));
    }
  }

  cargarDatos(): void {
    this.cargando = true;
    console.log('[modelador] cargarDatos iniciado, procesoId:', this.procesoId);

    forkJoin({
      actividades: this.actividadService.listarPorProceso(this.procesoId).pipe(catchError(() => of([]))),
      gateways: this.gatewayService.listarPorProceso(this.procesoId).pipe(catchError(() => of([]))),
      arcos: this.arcoService.listarPorProceso(this.procesoId).pipe(catchError(() => of([]))),
    }).subscribe({
      next: (result: any) => {
        console.log('[modelador] forkJoin result:', result);
        const actividades: any[] = result.actividades ?? [];
        const gateways: any[] = result.gateways ?? [];
        const arcos: any[] = result.arcos ?? [];

        const nodes: Node[] = [];

        actividades.forEach((a: any) => nodes.push({
          id: `actividad_${a.id}`,
          label: a.nombre,
          data: {
            nodeType: 'actividad',
            backendId: a.id,
            nombre: a.nombre,
            tipo: a.tipo,
            descripcion: a.descripcion,
            rolResponsableId: a.rolResponsableId,
            rolNombre: this.getRolNombre(a.rolResponsableId),
            posicionX: a.posicionX ?? null,
            posicionY: a.posicionY ?? null,
          },
        }));

        gateways.forEach((g: any) => nodes.push({
          id: `gateway_${g.id}`,
          label: g.nombre,
          data: {
            nodeType: 'gateway',
            backendId: g.id,
            nombre: g.nombre,
            tipo: g.tipo,
            posicionX: g.posicionX ?? null,
            posicionY: g.posicionY ?? null,
          },
        }));

        const links = arcos
          .filter((a: any) => (a.actividadOrigenId || a.gatewayOrigenId) && (a.actividadDestinoId || a.gatewayDestinoId))
          .map((a: any) => ({
            id: `arco_${a.id}`,
            source: a.actividadOrigenId ? `actividad_${a.actividadOrigenId}` : `gateway_${a.gatewayOrigenId}`,
            target: a.actividadDestinoId ? `actividad_${a.actividadDestinoId}` : `gateway_${a.gatewayDestinoId}`,
            label: a.condicion || '',
            data: { backendId: a.id, condicion: a.condicion },
          }));

        this.layout = 'dagre';
        this.nodes = nodes;
        this.links = links;

        console.log('[modelador] cargando = false, nodes:', this.nodes.length);
        this.cargando = false;
        this.cdr.detectChanges();

        const hasPosiciones = nodes.some(n => n.data.posicionX != null && n.data.posicionY != null);
        if (hasPosiciones) {
          setTimeout(() => this.aplicarPosicionesGuardadas(), 800);
        } else {
          setTimeout(() => this.refreshGraph(), 300);
        }
      },
      error: (e: any) => {
        console.error('[modelador] forkJoin error:', e);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalActividad(): void {
    this.newActividad = { nombre: '', tipo: 'TAREA', descripcion: '', rolResponsableId: undefined };
    this.showAddActividadModal = true;
  }

  guardarActividad(): void {
    if (!this.newActividad.nombre.trim() || this.guardando) return;
    this.guardando = true;
    this.actividadService.crear({
      nombre: this.newActividad.nombre,
      tipo: this.newActividad.tipo,
      descripcion: this.newActividad.descripcion,
      procesoId: this.procesoId,
      rolResponsableId: this.newActividad.rolResponsableId,
    }).subscribe({
      next: (a: any) => {
        this.nodes = [...this.nodes, {
          id: `actividad_${a.id}`,
          label: a.nombre,
          data: { nodeType: 'actividad', backendId: a.id, nombre: a.nombre, tipo: a.tipo, descripcion: a.descripcion, rolResponsableId: a.rolResponsableId, rolNombre: this.getRolNombre(a.rolResponsableId) },
        }];
        this.showAddActividadModal = false;
        this.guardando = false;
        this.cdr.detectChanges();
        this.refreshGraph();
      },
      error: () => { this.guardando = false; },
    });
  }

  abrirModalGateway(): void {
    this.newGateway = { nombre: '', tipo: 'EXCLUSIVO' };
    this.showAddGatewayModal = true;
  }

  guardarGateway(): void {
    if (!this.newGateway.nombre.trim() || this.guardando) return;
    this.guardando = true;
    this.gatewayService.crear({
      nombre: this.newGateway.nombre,
      tipo: this.newGateway.tipo,
      procesoId: this.procesoId,
    }).subscribe({
      next: g => {
        this.nodes = [...this.nodes, {
          id: `gateway_${g.id}`,
          label: g.nombre,
          data: { nodeType: 'gateway', backendId: g.id, nombre: g.nombre, tipo: g.tipo },
        }];
        this.showAddGatewayModal = false;
        this.guardando = false;
        this.cdr.detectChanges();
        this.refreshGraph();
      },
      error: () => { this.guardando = false; },
    });
  }

  crearArco(): void {
    if (!this.linkSource || !this.linkTarget || this.linkSource === this.linkTarget || this.guardando) return;
    this.guardando = true;

    const parseId = (nodeId: string) => ({ type: nodeId.split('_')[0], id: parseInt(nodeId.split('_')[1]) });
    const src = parseId(this.linkSource);
    const tgt = parseId(this.linkTarget);

    this.arcoService.crear({
      condicion: this.linkCondicion,
      procesoId: this.procesoId,
      actividadOrigenId: src.type === 'actividad' ? src.id : undefined,
      gatewayOrigenId: src.type === 'gateway' ? src.id : undefined,
      actividadDestinoId: tgt.type === 'actividad' ? tgt.id : undefined,
      gatewayDestinoId: tgt.type === 'gateway' ? tgt.id : undefined,
    }).subscribe({
      next: arco => {
        this.links = [...this.links, {
          id: `arco_${arco.id}`,
          source: this.linkSource!,
          target: this.linkTarget!,
          label: arco.condicion || '',
          data: { backendId: arco.id, condicion: arco.condicion },
        }];
        this.linkSource = null;
        this.linkTarget = null;
        this.linkCondicion = '';
        this.refreshGraph();
        this.guardando = false;
      },
      error: () => { this.guardando = false; },
    });
  }

  onNodeClick(node: Node): void {
    this.selectedNode = node;
    this.editableNode = {
      nombre: node.data.nombre,
      tipo: node.data.tipo,
      descripcion: node.data.descripcion || '',
      rolResponsableId: node.data.rolResponsableId,
    };
    this.showEditModal = true;
  }

  guardarCambiosNodo(): void {
    if (!this.selectedNode || this.guardando) return;
    this.guardando = true;
    const node = this.selectedNode;

    if (node.data.nodeType === 'actividad') {
      this.actividadService.actualizar(node.data.backendId, {
        nombre: this.editableNode.nombre,
        tipo: this.editableNode.tipo as TipoActividad,
        descripcion: this.editableNode.descripcion,
        procesoId: this.procesoId,
        rolResponsableId: this.editableNode.rolResponsableId,
      }).subscribe({
        next: (a: any) => {
          node.label = a.nombre;
          Object.assign(node.data, { nombre: a.nombre, tipo: a.tipo, descripcion: a.descripcion, rolResponsableId: a.rolResponsableId, rolNombre: this.getRolNombre(a.rolResponsableId) });
          this.nodes = [...this.nodes];
          this.refreshGraph();
          this.cerrarModal();
          this.guardando = false;
        },
        error: () => { this.guardando = false; },
      });
    } else {
      this.gatewayService.actualizar(node.data.backendId, {
        nombre: this.editableNode.nombre,
        tipo: this.editableNode.tipo as TipoGateway,
        procesoId: this.procesoId,
      }).subscribe({
        next: g => {
          node.label = g.nombre;
          Object.assign(node.data, { nombre: g.nombre, tipo: g.tipo });
          this.nodes = [...this.nodes];
          this.refreshGraph();
          this.cerrarModal();
          this.guardando = false;
        },
        error: () => { this.guardando = false; },
      });
    }
  }

  eliminarNodo(): void {
    if (!this.selectedNode || this.guardando) return;
    if (!confirm(`¿Eliminar "${this.selectedNode.data.nombre}"? Sus arcos también se eliminarán.`)) return;
    this.guardando = true;
    const node = this.selectedNode;

    const arcosConectados = this.links.filter(l => l.source === node.id || l.target === node.id);
    const deleteNode$ = node.data.nodeType === 'actividad'
      ? this.actividadService.eliminar(node.data.backendId)
      : this.gatewayService.eliminar(node.data.backendId);

    const borrarArcosThen = () => {
      deleteNode$.subscribe({
        next: () => {
          this.nodes = this.nodes.filter(n => n.id !== node.id);
          this.links = this.links.filter(l => l.source !== node.id && l.target !== node.id);
          this.cerrarModal();
          this.guardando = false;
          this.cdr.detectChanges();
          this.refreshGraph();
        },
        error: () => { this.guardando = false; },
      });
    };

    if (arcosConectados.length > 0) {
      forkJoin(arcosConectados.map(l => this.arcoService.eliminar(l.data.backendId))).subscribe({
        next: () => borrarArcosThen(),
        error: () => { this.guardando = false; },
      });
    } else {
      borrarArcosThen();
    }
  }

  cerrarModal(): void {
    this.showEditModal = false;
    this.selectedNode = null;
  }

  refreshGraph(): void {
    setTimeout(() => {
      this.update$.next(true);
      setTimeout(() => {
        try { this.zoomToFit$.next({ autoCenter: true } as any); } catch (_) {}
      }, 600);
    }, 100);
  }

  guardarPosiciones(): void {
    const internalNodes: any[] = this.graphRef?.graph?.nodes ?? [];
    if (internalNodes.length === 0) {
      alert('No hay posiciones para guardar todavía.');
      return;
    }

    this.guardando = true;
    const updates: any[] = [];

    internalNodes.forEach((n: any) => {
      const x: number = n.position?.x ?? n.x;
      const y: number = n.position?.y ?? n.y;
      if (x == null || y == null) return;

      const ourNode = this.nodes.find(on => on.id === n.id);
      if (!ourNode) return;
      const { nodeType, backendId } = ourNode.data;

      if (nodeType === 'actividad') {
        updates.push(
          this.actividadService.actualizar(backendId, {
            nombre: ourNode.data.nombre,
            tipo: ourNode.data.tipo,
            descripcion: ourNode.data.descripcion,
            procesoId: this.procesoId,
            rolResponsableId: ourNode.data.rolResponsableId,
            posicionX: x,
            posicionY: y,
          })
        );
      } else if (nodeType === 'gateway') {
        updates.push(
          this.gatewayService.actualizar(backendId, {
            nombre: ourNode.data.nombre,
            tipo: ourNode.data.tipo,
            procesoId: this.procesoId,
            posicionX: x,
            posicionY: y,
          })
        );
      }
    });

    if (updates.length === 0) {
      this.guardando = false;
      alert('No hay posiciones para guardar todavía.');
      return;
    }

    forkJoin([...updates]).subscribe({
      next: () => {
        this.guardando = false;
        alert('Posiciones guardadas correctamente.');
      },
      error: () => {
        this.guardando = false;
        alert('Error al guardar las posiciones.');
      },
    });
  }

  aplicarPosicionesGuardadas(): void {
    const hasPosiciones = this.nodes.some(n => n.data.posicionX != null && n.data.posicionY != null);
    if (!hasPosiciones) {
      this.refreshGraph();
      return;
    }

    const nodeMap = new Map(this.nodes.map(n => [n.id, n.data]));

    this.layout = {
      run: (graph: any) => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        graph.nodes?.forEach((n: any) => {
          const data = nodeMap.get(n.id);
          const x: number = data?.posicionX;
          const y: number = data?.posicionY;
          const w = n.dimension?.width ?? 160;
          const h = n.dimension?.height ?? 50;

          if (x != null && y != null) {
            n.position = { x, y };
          }

          const px = n.position?.x ?? 0;
          const py = n.position?.y ?? 0;
          minX = Math.min(minX, px - w / 2);
          minY = Math.min(minY, py - h / 2);
          maxX = Math.max(maxX, px + w / 2);
          maxY = Math.max(maxY, py + h / 2);
        });

        // Calcular rutas de arcos basadas en posiciones de nodos
        const posMap = new Map<string, { x: number; y: number }>();
        graph.nodes?.forEach((n: any) => posMap.set(n.id, n.position ?? { x: 0, y: 0 }));

        const edges = graph.edges ?? graph.links ?? [];
        edges.forEach((edge: any) => {
          const src = posMap.get(edge.source);
          const tgt = posMap.get(edge.target);
          if (src && tgt) {
            edge.points = [
              { x: src.x, y: src.y },
              { x: tgt.x, y: tgt.y },
            ];
          }
        });

        graph.width  = isFinite(maxX - minX) ? maxX - minX + 200 : 800;
        graph.height = isFinite(maxY - minY) ? maxY - minY + 200 : 600;

        return of(graph);
      }
    } as any;

    this.cdr.detectChanges();
    setTimeout(() => {
      this.update$.next(true);
      setTimeout(() => {
        try { this.zoomToFit$.next({ autoCenter: true } as any); } catch (_) {}
      }, 400);
    }, 50);
  }


  limpiarDiagrama(): void {
    if (this.guardando) return;
    if (!confirm('¿Eliminar TODOS los elementos del diagrama? Esta acción no se puede deshacer.')) return;
    this.guardando = true;

    const deleteArcos$ = this.links.length > 0
      ? forkJoin(this.links.map(l => this.arcoService.eliminar(l.data['backendId'])))
      : of([]);

    deleteArcos$.subscribe({
      next: () => {
        const actividades = this.nodes.filter(n => n.data['nodeType'] === 'actividad');
        const gateways = this.nodes.filter(n => n.data['nodeType'] === 'gateway');

        const deletes = [
          ...actividades.map(n => this.actividadService.eliminar(n.data['backendId'])),
          ...gateways.map(n => this.gatewayService.eliminar(n.data['backendId'])),
        ];

        const deleteAll$ = deletes.length > 0 ? forkJoin(deletes) : of([]);
        deleteAll$.subscribe({
          next: () => {
            this.nodes = [];
            this.links = [];
            this.layout = 'dagre';
            this.guardando = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.guardando = false;
            alert('Ocurrió un error al eliminar algunos elementos.');
          },
        });
      },
      error: () => {
        this.guardando = false;
        alert('Ocurrió un error al eliminar los arcos.');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/gestor-procesos']);
  }

  getRolNombre(id?: number): string {
    return this.roles.find(r => r.id === id)?.nombre ?? '—';
  }

  getTipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      TAREA: 'Tarea', SUBPROCESO: 'Subproceso',
      EVENTO_INICIO: 'Evento Inicio', EVENTO_FIN: 'Evento Fin',
      EXCLUSIVO: 'Exclusivo', PARALELO: 'Paralelo', INCLUSIVO: 'Inclusivo',
    };
    return map[tipo] ?? tipo;
  }
}
