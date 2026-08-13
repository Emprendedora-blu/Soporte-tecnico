import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { AuthService } from '../../../core/services/auth.service';
import { PRIORIDADES_SOLICITUD, Solicitud, SolicitudRequest } from '../../../core/models/solicitud.model';
import { EstadoBadge } from '../../../shared/estado-badge/estado-badge';
import { PrioridadBadge } from '../../../shared/prioridad-badge/prioridad-badge';
import { StatCard } from '../../../shared/stat-card/stat-card';
import { extractErrorMessage } from '../../../core/utils/error.util';

type Tab = 'todas' | 'pendientes' | 'resueltas';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, EstadoBadge, PrioridadBadge, StatCard],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.scss',
})
export class MisSolicitudes {
  private readonly solicitudService = inject(SolicitudService);
  private readonly clienteService = inject(ClienteService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly prioridades = PRIORIDADES_SOLICITUD;
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly tab = signal<Tab>('todas');

  readonly stats = computed(() => {
    const list = this.solicitudes();
    return {
      total: list.length,
      activas: list.filter((s) => s.estado === 'PENDIENTE' || s.estado === 'EN_PROCESO').length,
      resueltas: list.filter((s) => s.estado === 'RESUELTA').length,
    };
  });

  readonly filtradas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const tab = this.tab();
    return this.solicitudes().filter((s) => {
      const matchesTerm = !term || s.titulo.toLowerCase().includes(term);
      const matchesTab =
        tab === 'todas' ||
        (tab === 'pendientes' && (s.estado === 'PENDIENTE' || s.estado === 'EN_PROCESO')) ||
        (tab === 'resueltas' && s.estado === 'RESUELTA');
      return matchesTerm && matchesTab;
    });
  });

  readonly modalOpen = signal(false);
  readonly editing = signal<Solicitud | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  // Se activa cuando el backend responde que el usuario aun no tiene un perfil de Cliente creado.
  readonly necesitaPerfil = signal(false);
  readonly pendingSolicitud = signal<SolicitudRequest | null>(null);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    prioridad: ['MEDIA' as Solicitud['prioridad'], Validators.required],
  });

  readonly perfilForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    empresa: [''],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.solicitudService.getMisSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar tus solicitudes.'));
        this.loading.set(false);
      },
    });
  }

  puedeEditar(s: Solicitud): boolean {
    return s.estado === 'PENDIENTE';
  }

  colorPrioridad(s: Solicitud): string {
    const map: Record<Solicitud['prioridad'], string> = {
      CRITICA: 'var(--color-violet)',
      ALTA: 'var(--color-danger)',
      MEDIA: 'var(--color-warning)',
      BAJA: 'var(--color-success)',
    };
    return map[s.prioridad];
  }

  abrirCrear(): void {
    this.editing.set(null);
    this.form.reset({ titulo: '', descripcion: '', prioridad: 'MEDIA' });
    this.formError.set(null);
    this.necesitaPerfil.set(false);
    this.modalOpen.set(true);
  }

  abrirEditar(s: Solicitud): void {
    this.editing.set(s);
    this.form.reset({ titulo: s.titulo, descripcion: s.descripcion, prioridad: s.prioridad });
    this.formError.set(null);
    this.necesitaPerfil.set(false);
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
    this.necesitaPerfil.set(false);
    this.pendingSolicitud.set(null);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    const request = this.form.getRawValue();
    const editing = this.editing();

    if (editing) {
      this.solicitudService.actualizar(editing.id, request).subscribe({
        next: () => this.onSaved(),
        error: (err) =>
          this.onSaveError(extractErrorMessage(err, 'No se pudo actualizar la solicitud.')),
      });
      return;
    }

    this.crearSolicitud(request);
  }

  private crearSolicitud(request: SolicitudRequest): void {
    this.solicitudService.crear(request).subscribe({
      next: () => this.onSaved(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // Aun no existe un perfil de Cliente para este usuario: pedirlo antes de reintentar.
          this.saving.set(false);
          this.pendingSolicitud.set(request);
          this.prellenarPerfil();
          this.necesitaPerfil.set(true);
          return;
        }
        this.onSaveError(extractErrorMessage(err, 'No se pudo crear la solicitud.'));
      },
    });
  }

  private prellenarPerfil(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.perfilForm.patchValue({
      nombre: `${user.firstName} ${user.lastName}`.trim(),
      correo: user.email,
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    this.clienteService.crear(this.perfilForm.getRawValue()).subscribe({
      next: () => {
        this.necesitaPerfil.set(false);
        const pending = this.pendingSolicitud();
        if (pending) {
          this.crearSolicitud(pending);
        } else {
          this.saving.set(false);
        }
      },
      error: (err) => this.onSaveError(extractErrorMessage(err, 'No se pudo crear tu perfil de cliente.')),
    });
  }

  private onSaved(): void {
    this.saving.set(false);
    this.modalOpen.set(false);
    this.pendingSolicitud.set(null);
    this.cargar();
  }

  private onSaveError(message: string): void {
    this.saving.set(false);
    this.formError.set(message);
  }
}