import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { UsuarioService } from '../../services/usuario.service';
import { EmpresaRequest } from '../../models/empresa.model';
import { UsuarioRequest } from '../../models/usuario.model';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-empresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registrar-empresa.html',
  styleUrl: './registrar-empresa.css'
})
export class RegistrarEmpresa {
  registroForm: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreAdmin: ['', Validators.required],
      correoAdmin: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      nombreEmpresa: ['', Validators.required],
      nit: ['', Validators.required],
      correoContacto: ['', [Validators.required, Validators.email]]
    });
  }

  volver() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.cargando = true;
      const empresaData: EmpresaRequest = {
        nombre: this.registroForm.value.nombreEmpresa,
        nit: this.registroForm.value.nit,
        correoContacto: this.registroForm.value.correoContacto
      };

      this.empresaService.crear(empresaData).pipe(
        switchMap(empresaCreada => {
          if (!empresaCreada || !empresaCreada.id) {
            throw new Error('No se pudo obtener el ID de la empresa creada.');
          }

          const usuarioData: UsuarioRequest = {
            nombre: this.registroForm.value.nombreAdmin,
            correo: this.registroForm.value.correoAdmin,
            contrasena: this.registroForm.value.contrasena,
            rol: 'ADMINISTRADOR',
            empresaId: empresaCreada.id
          };
          
          return this.usuarioService.crear(usuarioData);
        })
      ).subscribe({
        next: () => {
          this.cargando = false;
          alert('¡Registro exitoso! Empresa y administrador creados correctamente.');
          this.router.navigate(['/dashboard-general']);
        },
        error: (err) => {
          this.cargando = false;
          console.error('DETALLE DEL ERROR:', err);
          
          // Lógica de mensajes para el usuario
          let mensajeVisible = 'Hubo un error al procesar el registro.';
          
          if (err.status === 409) {
            mensajeVisible = 'El NIT de la empresa o el correo del administrador ya están registrados.';
          } else if (err.status === 400) {
            mensajeVisible = 'Los datos enviados son incorrectos. Por favor verifícalos.';
          } else if (err.status === 0) {
            mensajeVisible = 'No hay conexión con el servidor.';
          }

          alert(`Error: ${mensajeVisible}`);
        }
      });
    }
  }
}