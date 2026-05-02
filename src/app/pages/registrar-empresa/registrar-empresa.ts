import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { UsuarioService } from '../../services/usuario.service'; // Asumiendo que existe
import { EmpresaRequest } from '../../models/empresa.model';
import { UsuarioRequest } from '../../models/usuario.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-empresa',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-empresa.html',
  styleUrl: './registrar-empresa.css'
})
export class RegistrarEmpresa {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      // Datos del Administrador (Izquierda en imagen)
      nombreAdmin: ['', Validators.required],
      correoAdmin: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      // Datos de la Empresa (Derecha en imagen)
      nombreEmpresa: ['', Validators.required],
      nit: ['', Validators.required], // Requerido por HU-01
      correoContacto: ['', [Validators.required, Validators.email]]
    });
  }

  volver() {
    this.router.navigate(['/']);
  }

 onSubmit() {
  if (this.registroForm.valid) {
    const empresaData: EmpresaRequest = {
      nombre: this.registroForm.value.nombreEmpresa,
      nit: this.registroForm.value.nit,
      correoContacto: this.registroForm.value.correoContacto
    };

    this.empresaService.crear(empresaData).pipe(
      switchMap(empresaCreada => {
        // VALIDACIÓN CRÍTICA:
        if (!empresaCreada || !empresaCreada.id) {
          throw new Error('El backend no devolvió un ID de empresa válido. Revisa el modelo Empresa.');
        }

        const usuarioData: UsuarioRequest = {
          nombre: this.registroForm.value.nombreAdmin,
          correo: this.registroForm.value.correoAdmin,
          contrasena: this.registroForm.value.contrasena,
          rol: 'ADMINISTRADOR',
          empresaId: empresaCreada.id //[cite: 1]
        };
        
        return this.usuarioService.crear(usuarioData); //[cite: 1]
      })
    ).subscribe({
      next: () => {
        console.log('Todo salió bien, redirigiendo...');
        this.router.navigate(['/dashboard-general']); //[cite: 1]
      },
      error: (err) => {
        // Esto te dirá en la consola si el error es 400, 401, 500, etc.
        console.error('DETALLE DEL ERROR:', err);
        alert(`Error: ${err.error?.message || err.message || 'Error desconocido'}`);
      }
    });
  }
}
}