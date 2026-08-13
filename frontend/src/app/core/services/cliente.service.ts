import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import { Cliente, ClienteRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly baseUrl = `${environment.solicitudesServiceUrl}/api/clientes`;

  constructor(private readonly http: HttpClient) {}

  // Solo ADMIN
  getAll(): Observable<Cliente[]> {
    return this.http.get<ApiEnvelope<Cliente[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  // ADMIN o CLIENTE (el propio CLIENTE crea su perfil una vez, antes de registrar solicitudes)
  crear(request: ClienteRequest): Observable<Cliente> {
    return this.http
      .post<ApiEnvelope<Cliente>>(this.baseUrl, request)
      .pipe(map((res) => res.data));
  }

  // Solo ADMIN
  actualizar(id: number, request: ClienteRequest): Observable<Cliente> {
    return this.http
      .put<ApiEnvelope<Cliente>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((res) => res.data));
  }

  // Solo ADMIN
  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiEnvelope<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}