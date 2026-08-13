import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;

  private readonly adminItems: NavItem[] = [
    { label: 'Solicitudes', route: '/admin/solicitudes', icon: 'clipboard' },
    { label: 'Usuarios', route: '/admin/usuarios', icon: 'user' },
    { label: 'Clientes', route: '/admin/clientes', icon: 'building' },
    { label: 'Técnicos', route: '/admin/tecnicos', icon: 'wrench' },
  ];

  private readonly clienteItems: NavItem[] = [
    { label: 'Mis solicitudes', route: '/cliente/mis-solicitudes', icon: 'clipboard' },
  ];

  private readonly tecnicoItems: NavItem[] = [
    { label: 'Mis asignaciones', route: '/tecnico/mis-asignaciones', icon: 'clipboard' },
  ];

  get subtitle(): string {
    if (this.isAdmin()) return 'Panel de administración';
    if (this.isTecnico()) return 'Panel de técnico';
    return 'Panel de cliente';
  }

  get navItems(): NavItem[] {
    if (this.isAdmin()) return this.adminItems;
    if (this.isTecnico()) return this.tecnicoItems;
    return this.clienteItems;
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  isCliente(): boolean {
    return this.authService.hasRole('CLIENTE');
  }

  isTecnico(): boolean {
    return this.authService.hasRole('TECNICO');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}