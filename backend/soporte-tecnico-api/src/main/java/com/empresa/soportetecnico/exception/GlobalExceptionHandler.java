package com.empresa.soportetecnico.exception;

import com.empresa.soportetecnico.common.ApiResponse;
import com.empresa.soportetecnico.common.ApiResponseUtil;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Manejo centralizado de excepciones para toda la API.
 *
 * Intercepta los errores lanzados desde cualquier controlador y los
 * traduce a respuestas HTTP coherentes, con codigos de estado
 * contextualizados y mensajes claros para el cliente que consume la API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Recurso no encontrado (Solicitud, Cliente o Tecnico) -> 404 NOT FOUND.
     */
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ApiResponse<Object>> manejarRecursoNoEncontrado(
            RecursoNoEncontradoException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponseUtil.notFound(ex.getMessage()));
    }

    /*
     Regla de negocio incumplida (ej. prioridad o estado invalido) -> 400 BAD REQUEST.
     */
    @ExceptionHandler(SolicitudInvalidaException.class)
    public ResponseEntity<ApiResponse<Object>> manejarSolicitudInvalida(
            SolicitudInvalidaException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseUtil.badRequest(ex.getMessage()));
    }

    /*
     Errores de validacion de @Valid sobre los DTO de entrada (@NotBlank,
     @NotNull, @Email, etc.) -> 400 BAD REQUEST, con el detalle de cada campo que fallo.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> manejarErroresDeValidacion(
            MethodArgumentNotValidException ex) {

        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errores.put(error.getField(), error.getDefaultMessage())
        );

        ApiResponse<Object> respuesta = ApiResponseUtil.badRequest("Error de validacion en los datos enviados");
        respuesta.setData(errores);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(respuesta);
    }

    /*
     Violaciones de restricciones a nivel de parametros (ej. @PathVariable,
     @RequestParam) -> 400 BAD REQUEST.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> manejarViolacionDeRestricciones(
            ConstraintViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseUtil.badRequest(ex.getMessage()));
    }

    /*
     Cualquier otra excepcion no controlada explicitamente -> 500 INTERNAL
     SERVER ERROR, evitando exponer detalles internos sensibles.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> manejarErrorGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseUtil.error("Ocurrio un error inesperado: " + ex.getMessage()));
    }
}
