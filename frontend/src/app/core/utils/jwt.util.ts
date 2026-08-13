import { JwtPayload } from '../models/auth.model';

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

/**
 * El claim "roles" del backend es un string separado por comas (ej. "ROLE_ADMIN").
 * En la base de datos (tabla roles.name) los nombres llevan el prefijo "ROLE_",
 * se retira aqui para trabajar con 'ADMIN' | 'CLIENTE' | 'TECNICO' en el resto de la app.
 */
export function parseRolesClaim(roles: string | undefined): string[] {
  if (!roles) return [];
  return roles
    .split(',')
    .map((r) => r.trim().replace(/^ROLE_/, ''))
    .filter(Boolean);
}