import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { TecnicoService } from '../../../core/services/tecnico.service';
import { ClienteService } from '../../../core/services/cliente.service';
import {
  ESTADOS_SOLICITUD,
  EstadoSolicitud,
  PRIORIDADES_SOLICITUD,
  PrioridadSolicitud,
  Solicitud,
} from '../../../core/models/solicitud.model';
import { Cliente, Tecnico } from '../../../core/models/usuario.model';
import { EstadoBadge } from '../../../shared/estado-badge/estado-badge';
import { PrioridadBadge } from '../../../shared/prioridad-badge/prioridad-badge';
import { StatCard } from '../../../shared/stat-card/stat-card';
import { extractErrorMessage } from '../../../core/utils/error.util';

type ModalType = 'form' | 'asignar' | 'estado' | null;

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, EstadoBadge, PrioridadBadge, StatCard],
  templateUrl: './admin-solicitudes.html',
  styleUrl: './admin-solicitudes.scss',
})
export class AdminSolicitudes {
  private readonly solicitudService = inject(SolicitudService);
  private readonly tecnicoService = inject(TecnicoService);
  private readonly clienteService = inject(ClienteService);
  private readonly fb = inject(FormBuilder);

  readonly prioridades = PRIORIDADES_SOLICITUD;
  readonly estados = ESTADOS_SOLICITUD;
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly tecnicos = signal<Tecnico[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Búsqueda, filtros y paginación (client-side, sobre lo ya cargado).
  readonly searchTerm = signal('');
  readonly filtroPrioridad = signal<PrioridadSolicitud | ''>('');
  readonly filtroEstado = signal<EstadoSolicitud | ''>('');
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly stats = computed(() => {
    const list = this.solicitudes();
    return {
      total: list.length,
      activas: list.filter((s) => s.estado === 'PENDIENTE' || s.estado === 'EN_PROCESO').length,
      resueltas: list.filter((s) => s.estado === 'RESUELTA').length,
      canceladas: list.filter((s) => s.estado === 'CANCELADA').length,
    };
  });

  readonly filtradas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const prioridad = this.filtroPrioridad();
    const estado = this.filtroEstado();

    return this.solicitudes().filter((s) => {
      const matchesTerm =
        !term ||
        s.titulo.toLowerCase().includes(term) ||
        s.cliente.nombre.toLowerCase().includes(term) ||
        (s.tecnicoAsignado?.nombre.toLowerCase().includes(term) ?? false);
      const matchesPrioridad = !prioridad || s.prioridad === prioridad;
      const matchesEstado = !estado || s.estado === estado;
      return matchesTerm && matchesPrioridad && matchesEstado;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtradas().length / this.pageSize())),
  );
  readonly safePage = computed(() => Math.min(this.page(), this.totalPages()));
  readonly paginaDeNumeros = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );
  readonly paginadas = computed(() => {
    const start = (this.safePage() - 1) * this.pageSize();
    return this.filtradas().slice(start, start + this.pageSize());
  });

  readonly modal = signal<ModalType>(null);
  readonly editing = signal<Solicitud | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    prioridad: ['MEDIA' as Solicitud['prioridad'], Validators.required],
    clienteId: [null as number | null],
  });

  readonly asignarForm = this.fb.nonNullable.group({
    tecnicoId: [null as number | null, Validators.required],
  });

  readonly estadoForm = this.fb.nonNullable.group({
    estado: ['' as Solicitud['estado'], Validators.required],
  });

  constructor() {
    this.cargar();
    this.tecnicoService.getAll().subscribe({ next: (data) => this.tecnicos.set(data) });
    this.clienteService.getAll().subscribe({ next: (data) => this.clientes.set(data) });
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.solicitudService.getAll().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar las solicitudes.'));
        this.loading.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.searchTerm.set('');
    this.filtroPrioridad.set('');
    this.filtroEstado.set('');
    this.page.set(1);
  }

  irAPagina(p: number): void {
    this.page.set(p);
  }

  abrirCrear(): void {
    this.editing.set(null);
    this.form.reset({ titulo: '', descripcion: '', prioridad: 'MEDIA', clienteId: null });
    this.formError.set(null);
    this.modal.set('form');
  }

  abrirEditar(s: Solicitud): void {
    this.editing.set(s);
    this.form.reset({
      titulo: s.titulo,
      descripcion: s.descripcion,
      prioridad: s.prioridad,
      clienteId: s.cliente.id,
    });
    this.formError.set(null);
    this.modal.set('form');
  }

  abrirAsignar(s: Solicitud): void {
    this.editing.set(s);
    this.asignarForm.reset({ tecnicoId: s.tecnicoAsignado?.id ?? null });
    this.formError.set(null);
    this.modal.set('asignar');
  }

  abrirEstado(s: Solicitud): void {
    this.editing.set(s);
    this.estadoForm.reset({ estado: s.estado });
    this.formError.set(null);
    this.modal.set('estado');
  }

  cerrarModal(): void {
    this.modal.set(null);
  }

  guardarForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    const value = this.form.getRawValue();
    const editing = this.editing();

    if (editing) {
      this.solicitudService
        .actualizar(editing.id, {
          titulo: value.titulo,
          descripcion: value.descripcion,
          prioridad: value.prioridad,
        })
        .subscribe({
          next: () => this.onSaved(),
          error: (err) => this.onSaveError(extractErrorMessage(err, 'No se pudo guardar la solicitud.')),
        });
      return;
    }

    this.solicitudService
      .crear({
        titulo: value.titulo,
        descripcion: value.descripcion,
        prioridad: value.prioridad,
        ...(value.clienteId ? { clienteId: value.clienteId } : {}),
      })
      .subscribe({
        next: () => this.onSaved(),
        error: (err) => this.onSaveError(extractErrorMessage(err, 'No se pudo crear la solicitud.')),
      });
  }

  guardarAsignacion(): void {
    const solicitud = this.editing();
    if (!solicitud || this.asignarForm.invalid) {
      this.asignarForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    const tecnicoId = this.asignarForm.getRawValue().tecnicoId as number;

    this.solicitudService.asignarTecnico(solicitud.id, { tecnicoId }).subscribe({
      next: () => this.onSaved(),
      error: (err) => this.onSaveError(extractErrorMessage(err, 'No se pudo asignar el técnico.')),
    });
  }

  guardarEstado(): void {
    const solicitud = this.editing();
    if (!solicitud || this.estadoForm.invalid) {
      this.estadoForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    this.solicitudService.cambiarEstado(solicitud.id, this.estadoForm.getRawValue()).subscribe({
      next: () => this.onSaved(),
      error: (err) => this.onSaveError(extractErrorMessage(err, 'No se pudo actualizar el estado.')),
    });
  }

  eliminar(s: Solicitud): void {
    if (!confirm(`¿Eliminar la solicitud #${s.id} "${s.titulo}"?`)) return;

    this.solicitudService.eliminar(s.id).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(extractErrorMessage(err, 'No se pudo eliminar la solicitud.')),
    });
  }

  private onSaved(): void {
    this.saving.set(false);
    this.modal.set(null);
    this.cargar();
  }

  private onSaveError(message: string): void {
    this.saving.set(false);
    this.formError.set(message);
  }
}