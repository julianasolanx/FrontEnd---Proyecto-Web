import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-inicial',
  standalone: true,
  imports: [],
  templateUrl: './layout-inicial.html',
  styleUrl: './layout-inicial.css'
})
export class LayoutInicial {
  constructor(private router: Router) {}

  navegarRegistro() {
    this.router.navigate(['/registrar-empresa']);
  }

  navegarLogin() {
    this.router.navigate(['/log-in']);
  }
}