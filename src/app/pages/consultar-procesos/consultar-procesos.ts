import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-procesos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-procesos.html',
  styleUrl: './consultar-procesos.css'
})
export class ConsultarProcesos implements OnInit {
  nombreEmpresa: string = 'Vista de Consulta';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Al igual que los otros, aquí se podría validar el rol 'LECTOR'
  }

  verListaProcesos(): void {
    // Redirige al gestor pero en modo visualización
    this.router.navigate(['/gestor-procesos']);
  }

  verListaRoles(): void {
    // Redirige al gestor de roles en modo visualización
    this.router.navigate(['/gestor-roles']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/log-in']);
  }
}