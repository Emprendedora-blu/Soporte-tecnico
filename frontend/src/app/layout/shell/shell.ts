import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;

  get displayName(): string {
    const user = this.user();
    if (!user) return 'Usuario';
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }

  get initials(): string {
    const user = this.user();
    if (!user) return 'ST';
    const first = user.firstName?.trim().charAt(0) ?? '';
    const last = user.lastName?.trim().charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || user.email.charAt(0).toUpperCase();
  }

  get primaryRole(): string {
    return this.user()?.roles[0] ?? 'USUARIO';
  }
}
