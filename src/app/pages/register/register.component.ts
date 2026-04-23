import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CrearUsuario } from '../../models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  datos: CrearUsuario = {
    nombre: '',
    correo: '',
    contrasena: '',
    rol: ''
  };

  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.datos.nombre || !this.datos.correo || !this.datos.contrasena || !this.datos.rol) {
      this.errorMsg = 'Por favor completa todos los campos.';
      return;
    }
    if (this.datos.contrasena.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.errorMsg = '';
    this.successMsg = '';
    this.loading = true;

    this.authService.registrar(this.datos).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = '¡Cuenta creada! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error al crear la cuenta.';
      }
    });
  }
}
