import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  volver() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { correo, contrasena } = this.loginForm.value;
    this.authService.login(correo, contrasena).subscribe({
      next: (response) => {
        if (response.id) {
          localStorage.setItem('empresaId', response.id.toString());
        }
        localStorage.setItem('usuarioRol', response.rol ?? '');
        this.router.navigate(['/dashboard-general']);
      },
      error: () => {
        alert('Credenciales inválidas. Por favor intente de nuevo.');
      }
    });
  }
}