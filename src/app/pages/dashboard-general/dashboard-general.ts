import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-general',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-general.html',
  styleUrl: './dashboard-general.css'
})
export class DashboardGeneral {

  constructor(private router: Router) {}

  irAUsuarios(): void {
    this.router.navigate(['/gestor-usuarios']);
  }

  irARoles(): void {
    this.router.navigate(['/gestor-roles']);
  }

  irAProcesos(): void {
    this.router.navigate(['/gestor-procesos']);
  }

  logout(): void {
    // Limpiamos los datos de sesión almacenados anteriormente
    localStorage.removeItem('empresaId');
    localStorage.removeItem('usuarioRol');
    // Redirigimos al layout-inicial según tu instrucción
    this.router.navigate(['/']);
  }
}