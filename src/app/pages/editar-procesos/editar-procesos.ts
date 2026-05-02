import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-procesos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editar-procesos.html',
  styleUrl: './editar-procesos.css'
})
export class EditarProcesos implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aquí podrías validar que solo entren editores si quieres seguridad extra
  }

  navegarAProcesos(): void {
    this.router.navigate(['/gestor-procesos']);
  }

  navegarARoles(): void {
    this.router.navigate(['/gestor-roles']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/log-in']);
  }
}