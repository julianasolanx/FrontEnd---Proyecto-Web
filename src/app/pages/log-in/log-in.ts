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
  isLoginMode: boolean = true; // Empieza en "Iniciar Sesión"

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

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  volver() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    if (this.isLoginMode) {
      // HU-03: Inicio de sesión
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (usuario: any) => { // Ponemos :any temporalmente para evitar errores de tipado
          
          // Magia aquí: Atrapamos el ID ya sea que venga como objeto o como atributo plano
          const idDeLaEmpresa = usuario.empresa?.id || usuario.empresaId; 
          
          if (idDeLaEmpresa) {
            localStorage.setItem('empresaId', idDeLaEmpresa.toString());
            console.log('¡Éxito! Empresa guardada con ID:', idDeLaEmpresa);
          } else {
            console.error('ALERTA: El backend no envió ni "empresa.id" ni "empresaId". Revisa tu UsuarioDTO en Spring Boot.');
          }

          // Redirección por roles según tu solicitud:
          if (usuario.rol === 'ADMINISTRADOR') {
            this.router.navigate(['/dashboard-general']);
          } else if (usuario.rol === 'EDITOR') {
            this.router.navigate(['/editar-procesos']);
          } else if (usuario.rol === 'SOLO_LECTURA') {
            this.router.navigate(['/consultar-procesos']);
          }
        },
        error: () => alert('Credenciales inválidas')
      });
    } else {
      // Si está en modo "Registrarse", lo mandamos a la HU-01
      this.router.navigate(['/registrar-empresa']);
    }
  }
}