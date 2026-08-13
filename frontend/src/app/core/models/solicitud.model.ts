import { Cliente, Tecnico } from './usuario.model';

export type EstadoSolicitud = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA' | 'CANCELADA';
export type PrioridadSolicitud = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export const ESTADOS_SOLICITUD: EstadoSolicitud[] = [
  'PENDIENTE',
  'EN_PROCESO',
  'RESUELTA',
  'CANCELADA',
];

export const PRIORIDADES_SOLICITUD: PrioridadSolicitud[] = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

export interface Solicitud {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoSolicitud;
  prioridad: PrioridadSolicitud;
  observaciones?: string;
  cliente: Cliente;
  tecnicoAsignado?: Tecnico;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/** POST /api/solicitudes. clienteId es opcional: si se omite, el backend usa el cliente del usuario autenticado. */
export interface SolicitudRequest {
  titulo: string;
  descripcion: string;
  prioridad: PrioridadSolicitud;
  clienteId?: number;
  tecnicoId?: number;
}

/** PUT /api/solicitudes/{id} — Solo ADMIN. Todos los campos son opcionales (actualizacion parcial). */
export interface SolicitudUpdateRequest {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadSolicitud;
  estado?: EstadoSolicitud;
  tecnicoId?: number;
}

/** PATCH /api/solicitudes/{id}/estado — ADMIN o TECNICO asignado. */
export interface CambiarEstadoRequest {
  estado: EstadoSolicitud;
  observaciones?: string;
}

/** PATCH /api/solicitudes/{id}/tecnico — Solo ADMIN. */
export interface AsignarTecnicoRequest {
  tecnicoId: number;
}