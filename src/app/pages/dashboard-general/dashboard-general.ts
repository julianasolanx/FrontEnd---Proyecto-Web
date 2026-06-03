import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-general',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-general.html',
  styleUrl: './dashboard-general.css'
})
export class DashboardGeneral {

  constructor(private router: Router, private authService: AuthService) {}

  irAUsuarios(): void {
    this.router.navigate(['/gestor-usuarios']);
  }

  irARoles(): void {
    this.router.navigate(['/gestor-roles']);
  }

  irAProcesos(): void {
    this.router.navigate(['/gestor-procesos']);
  }

  irAPool(): void {
    this.router.navigate(['/gestor-pool']);
  }

  logout(): void {
    this.authService.logout();
  }
}