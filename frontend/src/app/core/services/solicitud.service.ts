import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import {
  AsignarTecnicoRequest,
  CambiarEstadoRequest,
  Solicitud,
  SolicitudRequest,
  SolicitudUpdateRequest,
} from '../models/solicitud.model';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly baseUrl = `${environment.solicitudesServiceUrl}/solicitudes`;

  constructor(private readonly http: HttpClient) {}

  // ADMIN: ve todas las solicitudes
  getAll(): Observable<Solicitud[]> {
    return this.http
      .get<ApiEnvelope<Solicitud[]>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  // CLIENTE: ve solo las suyas
  getMisSolicitudes(): Observable<Solicitud[]> {
    return this.http
      .get<ApiEnvelope<Solicitud[]>>(`${this.baseUrl}/mis-solicitudes`)
      .pipe(map((res) => res.data));
  }

  // TECNICO: ve solo las asignadas a el
  getMisAsignaciones(): Observable<Solicitud[]> {
    return this.http
      .get<ApiEnvelope<Solicitud[]>>(`${this.baseUrl}/mis-asignaciones`)
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<Solicitud> {
    return this.http
      .get<ApiEnvelope<Solicitud>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  // ADMIN o CLIENTE (si se omite clienteId, el backend usa el cliente del usuario autenticado)
  crear(request: SolicitudRequest): Observable<Solicitud> {
    return this.http
      .post<ApiEnvelope<Solicitud>>(this.baseUrl, request)
      .pipe(map((res) => res.data));
  }

  // Solo ADMIN
  actualizar(id: number, request: SolicitudUpdateRequest): Observable<Solicitud> {
    return this.http
      .put<ApiEnvelope<Solicitud>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((res) => res.data));
  }

  // Solo ADMIN
  eliminar(id: number): Observable<void> {
    return this.http.delete<ApiEnvelope<void>>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
  }

  // ADMIN o TECNICO asignado
  cambiarEstado(id: number, request: CambiarEstadoRequest): Observable<Solicitud> {
    return this.http
      .put<ApiEnvelope<Solicitud>>(`${this.baseUrl}/${id}/estado`, request)
      .pipe(map((res) => res.data));
  }

  // Solo ADMIN
  asignarTecnico(id: number, request: AsignarTecnicoRequest): Observable<Solicitud> {
    return this.http
      .patch<ApiEnvelope<Solicitud>>(`${this.baseUrl}/${id}/tecnico`, request)
      .pipe(map((res) => res.data));
  }
}