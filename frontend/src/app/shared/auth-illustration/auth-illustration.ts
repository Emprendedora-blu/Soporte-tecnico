import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-illustration',
  standalone: true,
  templateUrl: './auth-illustration.html',
  styleUrl: './auth-illustration.scss',
})
export class AuthIllustration {
  @Input() subtitle = 'Gestiona tus solicitudes de forma rápida y sencilla';
}