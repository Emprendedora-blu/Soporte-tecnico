import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Rol, Usuario } from '../../../core/models/auth.model';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { StatCard } from '../../../shared/stat-card/stat-card';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, StatCard],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios {
  private readonly authService = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(FormBuilder);

  readonly roles: Rol[] = ['ADMIN', 'CLIENTE', 'TECNICO'];

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(true);
  readonly listError = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly filtroRol = signal<Rol | ''>('');

  readonly stats = computed(() => {
    const list = this.usuarios();
    return {
      total: list.length,
      admins: list.filter((u) => this.soloRol(u) === 'ADMIN').length,
      clientes: list.filter((u) => this.soloRol(u) === 'CLIENTE').length,
      tecnicos: list.filter((u) => this.soloRol(u) === 'TECNICO').length,
    };
  });

  readonly filtrados = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const rol = this.filtroRol();
    return this.usuarios().filter((u) => {
      const nombre = `${u.firstName} ${u.lastName}`.toLowerCase();
      const coincideTexto = !term || nombre.includes(term) || u.email.toLowerCase().includes(term);
      const coincideRol = !rol || this.soloRol(u) === rol;
      return coincideTexto && coincideRol;
    });
  });

  readonly modalOpen = signal(false);
  readonly editing = signal<Usuario | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['CLIENTE' as Rol, Validators.required],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.listError.set(null);
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.listError.set(extractErrorMessage(err, 'No se pudo cargar el listado de usuarios.'));
        this.loading.set(false);
      },
    });
  }

  soloRol(u: Usuario): Rol {
    return (u.roles[0]?.replace(/^ROLE_/, '') ?? 'CLIENTE') as Rol;
  }

  iniciales(u: Usuario): string {
    return `${u.firstName?.charAt(0) ?? ''}${u.lastName?.charAt(0) ?? ''}`.toUpperCase() || 'U';
  }

  esUsuarioActual(u: Usuario): boolean {
    return this.authService.currentUser()?.userId === u.id;
  }

  abrirCrear(): void {
    this.editing.set(null);
    this.form.reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rol: 'CLIENTE',
    });
    this.form.get('email')!.enable();
    this.form.get('password')!.enable();
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  abrirEditar(u: Usuario): void {
    this.editing.set(u);
    this.form.reset({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      password: '',
      rol: this.soloRol(u),
    });
    // El correo y la contraseña no se editan desde aquí (no hay endpoint para eso).
    this.form.get('email')!.disable();
    this.form.get('password')!.disable();
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    const value = this.form.getRawValue();
    const editing = this.editing();

    // Creacion: usa el endpoint protegido (solo ADMIN) que permite elegir el rol.
    // POST /auth/register es publico y siempre crea CLIENTE, sin importar lo que se pida.
    const request$ = editing
      ? this.usuarioService.actualizar(editing.id, {
          firstName: value.firstName,
          lastName: value.lastName,
          roleNames: [value.rol],
        })
      : this.usuarioService.crear({
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          password: value.password,
          roleNames: [value.rol],
        });

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.cargar();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(extractErrorMessage(err, 'No se pudo guardar el usuario.'));
      },
    });
  }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario "${u.email}"?`)) return;

    this.usuarioService.eliminar(u.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.listError.set(extractErrorMessage(err, 'No se pudo eliminar el usuario.')),
    });
  }
}
