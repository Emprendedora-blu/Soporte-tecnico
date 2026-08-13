import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { AuthIllustration } from '../../../shared/auth-illustration/auth-illustration';

/**
 * Auto-registro publico: siempre crea la cuenta con rol CLIENTE.
 * Las cuentas ADMIN/TECNICO se crean desde el panel de administracion.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthIllustration],
  templateUrl: './register.html',
  styleUrl: '../login/auth.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.register({ ...this.form.getRawValue(), roleNames: ['CLIENTE'] }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { registered: 1 } });
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error en registro:', err);
        this.error.set(
          extractErrorMessage(err, 'No se pudo completar el registro. Verifica los datos e intenta de nuevo.'),
        );
      },
    });
  }
}