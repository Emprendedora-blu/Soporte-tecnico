import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import {
  ESTADOS_SOLICITUD,
  EstadoSolicitud,
  PRIORIDADES_SOLICITUD,
  PrioridadSolicitud,
  Solicitud,
} from '../../../core/models/solicitud.model';
import { EstadoBadge } from '../../../shared/estado-badge/estado-badge';
import { PrioridadBadge } from '../../../shared/prioridad-badge/prioridad-badge';
import { StatCard } from '../../../shared/stat-card/stat-card';
import { extractErrorMessage } from '../../../core/utils/error.util';

@Component({
  selector: 'app-mis-asignaciones',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, EstadoBadge, PrioridadBadge, StatCard],
  templateUrl: './mis-asignaciones.html',
  styleUrl: './mis-asignaciones.scss',
})
export class MisAsignaciones {
  private readonly solicitudService = inject(SolicitudService);
  private readonly fb = inject(FormBuilder);

  readonly estados = ESTADOS_SOLICITUD;
  readonly prioridades = PRIORIDADES_SOLICITUD;
  readonly solicitudes = signal<Solicitud[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly filtroCliente = signal('');
  readonly filtroPrioridad = signal<PrioridadSolicitud | ''>('');
  readonly filtroEstado = signal<EstadoSolicitud | ''>('');

  readonly clientesUnicos = computed(() => {
    const nombres = this.solicitudes().map((s) => s.cliente.nombre);
    return Array.from(new Set(nombres)).sort();
  });

  readonly stats = computed(() => {
    const list = this.solicitudes();
    return {
      total: list.length,
      pendientes: list.filter((s) => s.estado === 'PENDIENTE').length,
      enProceso: list.filter((s) => s.estado === 'EN_PROCESO').length,
      resueltas: list.filter((s) => s.estado === 'RESUELTA').length,
    };
  });

  readonly filtradas = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const cliente = this.filtroCliente();
    const prioridad = this.filtroPrioridad();
    const estado = this.filtroEstado();

    return this.solicitudes().filter((s) => {
      const matchesTerm = !term || s.titulo.toLowerCase().includes(term);
      const matchesCliente = !cliente || s.cliente.nombre === cliente;
      const matchesPrioridad = !prioridad || s.prioridad === prioridad;
      const matchesEstado = !estado || s.estado === estado;
      return matchesTerm && matchesCliente && matchesPrioridad && matchesEstado;
    });
  });

  readonly modalOpen = signal(false);
  readonly editing = signal<Solicitud | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly closingId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    estado: ['PENDIENTE' as Solicitud['estado'], Validators.required],
    observaciones: [''],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.solicitudService.getMisAsignaciones().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar tus asignaciones.'));
        this.loading.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.searchTerm.set('');
    this.filtroCliente.set('');
    this.filtroPrioridad.set('');
    this.filtroEstado.set('');
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

  abrirActualizar(s: Solicitud): void {
    this.editing.set(s);
    this.form.reset({ estado: s.estado, observaciones: s.observaciones ?? '' });
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
  }

  puedeCerrar(s: Solicitud): boolean {
    return s.estado !== 'RESUELTA' && s.estado !== 'CANCELADA';
  }

  cerrarSolicitud(s: Solicitud): void {
    if (!confirm(`¿Marcar la solicitud #${s.id} "${s.titulo}" como resuelta?`)) return;

    this.closingId.set(s.id);
    this.error.set(null);

    this.solicitudService.cambiarEstado(s.id, { estado: 'RESUELTA' }).subscribe({
      next: () => {
        this.closingId.set(null);
        this.cargar();
      },
      error: (err) => {
        this.closingId.set(null);
        this.error.set(extractErrorMessage(err, 'No se pudo cerrar la solicitud.'));
      },
    });
  }

  guardar(): void {
    const solicitud = this.editing();
    if (!solicitud || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    this.solicitudService.cambiarEstado(solicitud.id, this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.cargar();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(extractErrorMessage(err, 'No se pudo actualizar la solicitud.'));
      },
    });
  }
}