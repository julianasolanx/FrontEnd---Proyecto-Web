import { Component, OnInit } from '@angular/core';
import { Edge, Node, Layout, NgxGraphZoomOptions } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';

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

  layout: string | Layout = 'dagre';
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<NgxGraphZoomOptions> = new Subject<NgxGraphZoomOptions>();

  roles: string[] = ['Developer', 'Manager', 'QA Analyst', 'Business Analyst'];
  gatewayTypes: string[] = ['Exclusive', 'Parallel', 'Inclusive'];
  activityTypes: string[] = ['Task', 'Subprocess', 'Event'];

  showModal = false;
  selectedNode: Node | null = null;
  editableNodeData: { name?: string; type?: string; role?: string; gatewayType?: string } = {};

  // For creating new links
  linkSource: string | null = null;
  linkTarget: string | null = null;

  ngOnInit(): void {
    this.nodes = [
      {
        id: 'start',
        label: 'Start',
        data: { nodeType: 'event' },
      },
      {
        id: 'activity1',
        label: 'Initial Task',
        data: {
          nodeType: 'activity',
          name: 'Initial Task',
          type: 'Task',
          role: 'Business Analyst',
        },
      },
      {
        id: 'gateway1',
        label: 'Exclusive Gateway',
        data: {
          nodeType: 'gateway',
          type: 'Exclusive',
        },
      },
      {
        id: 'end',
        label: 'End',
        data: { nodeType: 'event' },
      },
    ];

    this.links = [
      {
        id: 'a',
        source: 'start',
        target: 'activity1',
      },
      {
        id: 'b',
        source: 'activity1',
        target: 'gateway1',
      },
    ];
  }

  addActivity(): void {
    const id = `activity_${this.nodes.length + 1}`;
    const newNode: Node = {
      id,
      label: 'New Activity',
      data: {
        nodeType: 'activity',
        name: 'New Activity',
        type: this.activityTypes[0],
        role: this.roles[0],
      },
    };
    this.nodes = [...this.nodes, newNode];
    this.updateGraph();
  }

  addGateway(): void {
    const id = `gateway_${this.nodes.length + 1}`;
    const newNode: Node = {
      id,
      label: 'New Gateway',
      data: {
        nodeType: 'gateway',
        type: this.gatewayTypes[0],
      },
    };
    this.nodes = [...this.nodes, newNode];
    this.updateGraph();
  }

  createLink(): void {
    if (!this.linkSource || !this.linkTarget) {
      alert('Please select a source and a target node to create a link.');
      return;
    }
    if (this.linkSource === this.linkTarget) {
      alert('Source and target nodes cannot be the same.');
      return;
    }

    const id = `link_${this.linkSource}_${this.linkTarget}`;
    const newLink: Edge = {
      id,
      source: this.linkSource,
      target: this.linkTarget,
    };

    this.links = [...this.links, newLink];
    this.linkSource = null;
    this.linkTarget = null;
    this.updateGraph();
  }

  onNodeClick(node: Node): void {
    if (node.data.nodeType === 'activity' || node.data.nodeType === 'gateway') {
      this.selectedNode = node;
      if (node.data.nodeType === 'activity') {
        this.editableNodeData = {
          name: node.data.name,
          type: node.data.type,
          role: node.data.role,
        };
      } else if (node.data.nodeType === 'gateway') {
        this.editableNodeData = {
          gatewayType: node.data.type,
        };
      }
      this.showModal = true;
    }
  }

  saveNodeChanges(): void {
    if (!this.selectedNode) return;

    if (this.selectedNode.data.nodeType === 'activity') {
      this.selectedNode.label = this.editableNodeData.name;
      this.selectedNode.data.name = this.editableNodeData.name;
      this.selectedNode.data.type = this.editableNodeData.type;
      this.selectedNode.data.role = this.editableNodeData.role;
    } else if (this.selectedNode.data.nodeType === 'gateway') {
      this.selectedNode.label = `${this.editableNodeData.gatewayType} Gateway`;
      this.selectedNode.data.type = this.editableNodeData.gatewayType;
    }

    this.nodes = [...this.nodes];
    this.updateGraph();
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedNode = null;
    this.editableNodeData = {};
  }

  updateGraph(): void {
    this.update$.next(true);
    this.center$.next(true);
    this.zoomToFit$.next({});
  }
}
