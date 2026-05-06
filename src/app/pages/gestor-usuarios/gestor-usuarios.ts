import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { UsuarioService, EmailInvitacionRequest } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { UsuarioService, EmailInvitacionRequest, InvitarUsuarioRequest } from '../../services/usuario.service';

@Component({
  selector: 'app-gestor-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestor-usuarios.html',
  styleUrl: './gestor-usuarios.css'
})
export class GestorUsuarios implements OnInit {
  invitacionForm: FormGroup;
  usuarios: Usuario[] = [];
  empresaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.invitacionForm = this.fb.group({
      rol: ['SOLO_LECTURA', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const idStored = localStorage.getItem('empresaId');
    if (idStored) {
      this.empresaId = parseInt(idStored);
      this.cargarUsuarios();
    }
  }

  cargarUsuarios(): void {
    if (this.empresaId) {
      this.usuarioService.listarPorEmpresa(this.empresaId).subscribe({
        next: (data) => this.usuarios = data,
        error: (err) => console.error('Error al cargar usuarios', err)
      });
    }
  }

  /*invitarUsuario(): void {
    if (this.invitacionForm.valid) {
      const request: EmailInvitacionRequest = {
        to: this.invitacionForm.value.correo,
        subject: 'Invitación al Sistema de Gestión de Procesos',
        message: `Has sido invitado con el rol de ${this.invitacionForm.value.rol}.`
      };

      this.usuarioService.enviarInvitacion(request).subscribe({
        next: () => {
          alert('Invitación enviada con éxito');
          this.invitacionForm.reset({ rol: 'SOLO_LECTURA' });
          this.cargarUsuarios(); // Recarga la lista para mostrar al nuevo usuario
        },
        error: () => alert('Error al enviar invitación')
      });
    }
  }*/

  invitarUsuario(): void {
    if (this.invitacionForm.valid && this.empresaId) {
      const dto = {
        correo: this.invitacionForm.value.correo,
        rol: this.invitacionForm.value.rol,
        empresaId: this.empresaId
      };

      this.usuarioService.invitar(dto).subscribe({
        next: () => {
          alert('Invitación enviada. El usuario recibirá sus credenciales por correo.');
          this.invitacionForm.reset({ rol: 'SOLO_LECTURA' });
          this.cargarUsuarios();
        },
        error: (err) => {
          const msg = err?.error?.message || 'Error al enviar la invitación';
          alert(msg);
        }
      });
    }
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  irADashboard(): void {
    // Redirección fija sin importar el rol
    this.router.navigate(['/dashboard-general']);
  }
}