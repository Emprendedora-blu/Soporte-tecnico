export type Rol = 'ADMIN' | 'CLIENTE' | 'TECNICO';

export interface LoginRequest {
  email: string;
  password: string;
}

/** LoginResponse del backend (ms-users-main), dentro de ApiEnvelope.data */
export interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  roles: Rol[];
}

/** CreateUserRequest del backend: POST /api/v1/auth/register */
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleNames: Rol[];
}

export interface JwtPayload {
  sub: string; // email
  userId?: number;
  firstName?: string;
  lastName?: string;
  /** El backend serializa los roles como string separado por comas, ej. "ADMIN" */
  roles?: string;
  exp?: number;
  iat?: number;
}

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  roles: Rol[];
  userId?: number;
}

/** UserResponse del backend: GET /api/v1/users (solo ADMIN) */
export interface Usuario {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[]; // vienen con prefijo "ROLE_" (ej. "ROLE_ADMIN")
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/** UpdateUserRequest del backend: PUT /api/v1/users/{id} (solo ADMIN) */
export interface UpdateUsuarioRequest {
  firstName: string;
  lastName: string;
  roleNames: Rol[];
  isActive?: boolean;
}
