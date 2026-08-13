export interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
  empresa?: string;
  usuarioId?: number;
  fechaRegistro?: string;
}

export interface ClienteRequest {
  nombre: string;
  correo: string;
  telefono?: string;
  empresa?: string;
  /** Cuenta de login (rol CLIENTE) a la que se vincula este perfil. Solo la usa el ADMIN. */
  usuarioId?: number | null;
}

export interface Tecnico {
  id: number;
  nombre: string;
  correo: string;
  especialidad?: string;
  usuarioId?: number;
  fechaRegistro?: string;
}

export interface TecnicoRequest {
  nombre: string;
  correo: string;
  especialidad: string;
  /** Cuenta de login (rol TECNICO) a la que se vincula este perfil. */
  usuarioId?: number | null;
}