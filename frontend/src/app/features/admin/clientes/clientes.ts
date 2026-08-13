import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { Cliente } from '../../../core/models/usuario.model';
import { Solicitud } from '../../../core/models/solicitud.model';
import { Usuario } from '../../../core/models/auth.model';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { StatCard } from '../../../shared/stat-card/stat-card';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, StatCard],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes {
  private readonly clienteService = inject(ClienteService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly solicitudService = inject(SolicitudService);
  private readonly fb = inject(FormBuilder);

  readonly clientes = signal<Cliente[]>([]);
  readonly usuariosCliente = signal<Usuario[]>([]);
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');

  readonly stats = computed(() => {
    const list = this.clientes();
    const sols = this.solicitudes();
    const idsConSolicitudes = new Set(sols.map((s) => s.cliente.id));
    return {
      total: list.length,
      conEmpresa: list.filter((c) => Boolean(c.empresa?.trim())).length,
      sinEmpresa: list.filter((c) => !c.empresa?.trim()).length,
      conSolicitudes: list.filter((c) => idsConSolicitudes.has(c.id)).length,
    };
  });

  readonly filtrados = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.clientes();
    return this.clientes().filter((c) =>
      [c.nombre, c.correo, c.telefono ?? '', c.empresa ?? ''].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  });

  readonly modalOpen = signal(false);
  readonly editing = signal<Cliente | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    empresa: [''],
    usuarioId: [null as number | null],
  });

  constructor() {
    this.cargar();
    this.usuarioService.getAll().subscribe({
      next: (data) =>
        this.usuariosCliente.set(data.filter((u) => u.roles.some((r) => r.endsWith('CLIENTE')))),
    });
    this.solicitudService.getAll().subscribe({ next: (data) => this.solicitudes.set(data) });
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar los clientes.'));
        this.loading.set(false);
      },
    });
  }

  solicitudesDeCliente(clienteId: number): number {
    return this.solicitudes().filter((s) => s.cliente.id === clienteId).length;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0))
      .join('')
      .toUpperCase() || 'C';
  }

  abrirCrear(): void {
    this.editing.set(null);
    this.form.reset({ nombre: '', correo: '', telefono: '', empresa: '', usuarioId: null });
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  abrirEditar(c: Cliente): void {
    this.editing.set(c);
    this.form.reset({
      nombre: c.nombre,
      correo: c.correo,
      telefono: c.telefono ?? '',
      empresa: c.empresa ?? '',
      usuarioId: c.usuarioId ?? null,
    });
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
    const editing = this.editing();
    const value = this.form.getRawValue();

    const request$ = editing
      ? this.clienteService.actualizar(editing.id, value)
      : this.clienteService.crear(value);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.cargar();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(extractErrorMessage(err, 'No se pudo guardar el cliente.'));
      },
    });
  }

  eliminar(c: Cliente): void {
    if (!confirm(`¿Eliminar al cliente "${c.nombre}"?`)) return;

    this.clienteService.eliminar(c.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo eliminar el cliente.')),
    });
  }
}
