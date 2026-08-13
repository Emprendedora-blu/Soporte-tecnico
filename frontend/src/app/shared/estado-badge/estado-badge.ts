import { Component, Input } from '@angular/core';
import { EstadoSolicitud } from '../../core/models/solicitud.model';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge--' + estado.toLowerCase()">{{ label }}</span>`,
  styles: [
    `
      .badge--pendiente {
        background: var(--color-warning-soft);
        color: var(--color-warning);
      }
      .badge--en_proceso {
        background: var(--color-info-soft);
        color: var(--color-info);
      }
      .badge--resuelta {
        background: var(--color-success-soft);
        color: var(--color-success);
      }
      .badge--cancelada {
        background: var(--color-border);
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class EstadoBadge {
  @Input({ required: true }) estado!: EstadoSolicitud;

  private readonly labels: Record<EstadoSolicitud, string> = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En proceso',
    RESUELTA: 'Resuelta',
    CANCELADA: 'Cancelada',
  };

  get label(): string {
    return this.labels[this.estado] ?? this.estado;
  }
}