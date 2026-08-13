import { Component, Input } from '@angular/core';
import { PrioridadSolicitud } from '../../core/models/solicitud.model';

@Component({
  selector: 'app-prioridad-badge',
  standalone: true,
  template: `<span
    class="badge badge--dot-off"
    [class]="'badge--prio-' + prioridad.toLowerCase()"
    >{{ prioridad }}</span
  >`,
  styles: [
    `
      .badge--prio-baja {
        background: var(--color-success-soft);
        color: var(--color-success);
      }
      .badge--prio-media {
        background: var(--color-warning-soft);
        color: var(--color-warning);
      }
      .badge--prio-alta {
        background: var(--color-danger-soft);
        color: var(--color-danger);
      }
      .badge--prio-critica {
        background: var(--color-violet-soft);
        color: var(--color-violet);
      }
    `,
  ],
})
export class PrioridadBadge {
  @Input({ required: true }) prioridad!: PrioridadSolicitud;
}