import { HttpErrorResponse } from '@angular/common/http';

/**
 * El backend responde errores como ApiResponse { responseMessage, data }.
 * Cuando `data` es un mapa de errores de validacion (400), se anexan al mensaje.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;

  if (err.status === 0) {
    return `No se pudo conectar con el servidor (${err.url ?? ''}). Verifica que el microservicio esté corriendo.`;
  }

  const body = err.error as { responseMessage?: string; data?: unknown } | null;
  const baseMessage = body?.responseMessage ?? fallback;

  if (body?.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
    const detalles = Object.values(body.data as Record<string, string>).join(' | ');
    return detalles ? `${baseMessage}: ${detalles}` : baseMessage;
  }

  return baseMessage;
}
