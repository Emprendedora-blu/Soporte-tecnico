import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TecnicoService } from '../../../core/services/tecnico.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { Tecnico } from '../../../core/models/usuario.model';
import { Solicitud } from '../../../core/models/solicitud.model';
import { Usuario } from '../../../core/models/auth.model';
import { extractErrorMessage } from '../../../core/utils/error.util';
import { StatCard } from '../../../shared/stat-card/stat-card';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, StatCard],
  templateUrl: './tecnicos.html',
  styleUrl: './tecnicos.scss',
})
export class Tecnicos {
  private readonly tecnicoService = inject(TecnicoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly solicitudService = inject(SolicitudService);
  private readonly fb = inject(FormBuilder);

  readonly tecnicos = signal<Tecnico[]>([]);
  readonly usuariosTecnico = signal<Usuario[]>([]);
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');

  readonly stats = computed(() => {
    const list = this.tecnicos();
    const sols = this.solicitudes();
    const especialidades = new Set(
      list.map((t) => t.especialidad?.trim()).filter((value): value is string => Boolean(value)),
    );
    const idsAtendiendo = new Set(
      sols
        .filter((s) => s.estado === 'PENDIENTE' || s.estado === 'EN_PROCESO')
        .map((s) => s.tecnicoAsignado?.id)
        .filter((id): id is number => id != null),
    );
    return {
      total: list.length,
      disponibles: list.filter((t) => !idsAtendiendo.has(t.id)).length,
      atendiendo: list.filter((t) => idsAtendiendo.has(t.id)).length,
      especialidades: especialidades.size,
    };
  });

  readonly filtrados = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.tecnicos();
    return this.tecnicos().filter((t) =>
      [t.nombre, t.correo, t.especialidad ?? ''].some((value) => value.toLowerCase().includes(term)),
    );
  });

  readonly modalOpen = signal(false);
  readonly editing = signal<Tecnico | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    especialidad: ['', Validators.required],
    usuarioId: [null as number | null, Validators.required],
  });

  constructor() {
    this.cargar();
    this.usuarioService.getAll().subscribe({
      next: (data) =>
        this.usuariosTecnico.set(data.filter((u) => u.roles.some((r) => r.endsWith('TECNICO')))),
    });
    this.solicitudService.getAll().subscribe({ next: (data) => this.solicitudes.set(data) });
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tecnicoService.getAll().subscribe({
      next: (data) => {
        this.tecnicos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar los técnicos.'));
        this.loading.set(false);
      },
    });
  }

  solicitudesDeTecnico(tecnicoId: number): number {
    return this.solicitudes().filter((s) => s.tecnicoAsignado?.id === tecnicoId).length;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte.charAt(0))
      .join('')
      .toUpperCase() || 'T';
  }

  abrirCrear(): void {
    this.editing.set(null);
    this.form.reset({ nombre: '', correo: '', especialidad: '', usuarioId: null });
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  abrirEditar(t: Tecnico): void {
    this.editing.set(t);
    this.form.reset({
      nombre: t.nombre,
      correo: t.correo,
      especialidad: t.especialidad ?? '',
      usuarioId: t.usuarioId ?? null,
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
      ? this.tecnicoService.actualizar(editing.id, value)
      : this.tecnicoService.crear(value);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.cargar();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(extractErrorMessage(err, 'No se pudo guardar el técnico.'));
      },
    });
  }

  eliminar(t: Tecnico): void {
    if (!confirm(`¿Eliminar al técnico "${t.nombre}"?`)) return;

    this.tecnicoService.eliminar(t.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo eliminar el técnico.')),
    });
  }
}
