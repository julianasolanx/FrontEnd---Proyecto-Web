import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
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
    private usuarioService: UsuarioService,
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

    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (usuario: any) => {
       
        const idDeLaEmpresa = usuario.empresa?.id || usuario.empresaId;

        if (idDeLaEmpresa) {
          localStorage.setItem('empresaId', idDeLaEmpresa.toString());
        }

        
        this.router.navigate(['/dashboard-general']);
      },
      error: () => {
        alert('Credenciales inválidas. Por favor intente de nuevo.');
      }
    });
  }
}