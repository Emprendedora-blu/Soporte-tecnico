import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import { Tecnico, TecnicoRequest } from '../models/usuario.model';

/** Todos los endpoints de /api/tecnicos son exclusivos de ADMIN (TecnicoController). */
@Injectable({ providedIn: 'root' })
export class TecnicoService {
  private readonly baseUrl = `${environment.solicitudesServiceUrl}/api/tecnicos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Tecnico[]> {
    return this.http.get<ApiEnvelope<Tecnico[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  crear(request: TecnicoRequest): Observable<Tecnico> {
    return this.http
      .post<ApiEnvelope<Tecnico>>(this.baseUrl, request)
      .pipe(map((res) => res.data));
  }

  actualizar(id: number, request: TecnicoRequest): Observable<Tecnico> {
    return this.http
      .put<ApiEnvelope<Tecnico>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((res) => res.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<ApiEnvelope<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}