import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Rol,
} from '../models/auth.model';
import { decodeJwt, isTokenExpired, parseRolesClaim } from '../utils/jwt.util';

const TOKEN_KEY = 'st_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.userServiceUrl}/auth`;

  private readonly userSignal = signal<AuthUser | null>(this.buildUserFromStorage());

  readonly currentUser = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly roles = computed(() => this.userSignal()?.roles ?? []);

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiEnvelope<LoginResponse>>(`${this.baseUrl}/login`, request).pipe(
      map((res) => res.data),
      tap((data) => this.storeSession(data)),
    );
  }

  register(request: RegisterRequest): Observable<unknown> {
    // La tabla roles.name guarda los nombres con prefijo "ROLE_" (ej. "ROLE_ADMIN").
    const payload = { ...request, roleNames: request.roleNames.map((r) => `ROLE_${r}`) };
    return this.http
      .post<ApiEnvelope<unknown>>(`${this.baseUrl}/register`, payload)
      .pipe(map((res) => res.data));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(...allowed: Rol[]): boolean {
    const roles = this.roles();
    return allowed.some((r) => roles.includes(r));
  }

  /** Ruta de inicio segun el rol principal del usuario autenticado. */
  homeRouteForCurrentUser(): string {
    const roles = this.roles();
    if (roles.includes('ADMIN')) return '/admin';
    if (roles.includes('TECNICO')) return '/tecnico';
    if (roles.includes('CLIENTE')) return '/cliente';
    return '/login';
  }

  private storeSession(data: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    this.userSignal.set({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles.map((r) => r.replace(/^ROLE_/, '')) as Rol[],
      userId: data.id,
    });
  }

  private buildUserFromStorage(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;
    const user = this.buildUserFromToken(token);
    if (!user) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return user;
  }

  private buildUserFromToken(token: string): AuthUser | null {
    const payload = decodeJwt(token);
    if (!payload || isTokenExpired(payload)) return null;

    return {
      email: payload.sub,
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      roles: parseRolesClaim(payload.roles) as Rol[],
      userId: payload.userId,
    };
  }
}