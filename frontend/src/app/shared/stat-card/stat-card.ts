import { Component, Input } from '@angular/core';

export type StatCardTone = 'primary' | 'warning' | 'info' | 'success' | 'danger';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="stat-card" [class]="'stat-card--' + tone">
      <div class="stat-card__icon" aria-hidden="true">
        @switch (icon) {
          @case ('clock') {
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @case ('activity') {
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 13.5h3l2-5 3.5 9 2-5H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @case ('check') {
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="m8 12 2.6 2.6L16.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @case ('x-circle') {
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="m9.3 9.3 5.4 5.4M14.7 9.3l-5.4 5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          }
          @case ('users') {
            <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 18c.4-3.2 2.4-5.2 5-5.2s4.6 2 5 5.2M15 7.3a2.7 2.7 0 0 1 0 5.2M16.5 13.5c2 .6 3.2 2.1 3.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          }
          @case ('shield') {
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5 5.5 6v5c0 4.2 2.7 7.4 6.5 9.2 3.8-1.8 6.5-5 6.5-9.2V6L12 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m9.2 11.8 1.8 1.8 3.8-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @case ('link') {
            <svg viewBox="0 0 24 24" fill="none"><path d="m10 14 4-4M8.2 15.8l-1.1 1.1a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0M15.8 8.2l1.1-1.1a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          }
          @case ('building') {
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h8A1.5 1.5 0 0 1 16 5.5V20M16 9h2.5A1.5 1.5 0 0 1 20 10.5V20M3 20h19M8 8h2M8 12h2M8 16h2M13 8h.1M13 12h.1M13 16h.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @case ('wrench') {
            <svg viewBox="0 0 24 24" fill="none"><path d="M15.8 4.2a5 5 0 0 0-6.1 6.1L4.2 15.8a2.4 2.4 0 0 0 3.4 3.4l5.5-5.5a5 5 0 0 0 6.1-6.1l-3 3-2.8-2.8 2.4-3.6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
          @default {
            <svg viewBox="0 0 24 24" fill="none"><rect x="6" y="5" width="12" height="15" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M9 4.5h6V7H9zM9 11h6M9 15h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          }
        }
      </div>
      <div class="stat-card__body">
        <p class="stat-card__label">{{ label }}</p>
        <p class="stat-card__value">{{ value }}</p>
        @if (hint) {
          <p class="stat-card__hint">{{ hint }}</p>
        }
      </div>
    </div>
  `,
})
export class StatCard {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number | string;
  @Input() icon = 'clipboard';
  @Input() tone: StatCardTone = 'primary';
  @Input() hint = '';
}
