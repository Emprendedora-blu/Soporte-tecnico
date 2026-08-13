/** Envoltorio de respuesta comun a ambos microservicios (ApiResponse<T> en el backend). */
export interface ApiEnvelope<T> {
  responseCode: string;
  responseMessage: string;
  data: T;
  timestamp?: string;
}