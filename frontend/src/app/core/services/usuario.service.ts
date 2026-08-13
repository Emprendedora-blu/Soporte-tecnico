import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import { RegisterRequest, Usuario, UpdateUsuarioRequest } from '../models/auth.model';

/** Solo ADMIN. /api/v1/users (ms-users-main). */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly baseUrl = `${environment.userServiceUrl}/api/v1/users`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<ApiEnvelope<Usuario[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  /**
   * A diferencia de POST /auth/register (publico, siempre crea CLIENTE),
   * este endpoint requiere ser ADMIN y permite asignar cualquier rol.
   */
  crear(request: RegisterRequest): Observable<Usuario> {
    const payload = { ...request, roleNames: request.roleNames.map((r) => `ROLE_${r}`) };
    return this.http
      .post<ApiEnvelope<Usuario>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  actualizar(id: number, request: UpdateUsuarioRequest): Observable<Usuario> {
    // La tabla roles.name guarda los nombres con prefijo "ROLE_" (ej. "ROLE_ADMIN").
    const payload = { ...request, roleNames: request.roleNames.map((r) => `ROLE_${r}`) };
    return this.http
      .put<ApiEnvelope<Usuario>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiEnvelope<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}