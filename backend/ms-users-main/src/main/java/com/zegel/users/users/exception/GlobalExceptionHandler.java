package com.zegel.users.users.exception;

import com.zegel.users.users.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("FORBIDDEN")
            .responseMessage("No tienes permisos para acceder a este recurso")
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("NOT_FOUND")
            .responseMessage(ex.getMessage())
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        log.warn("Email already exists: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("CONFLICT")
            .responseMessage(ex.getMessage())
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RoleAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleRoleAlreadyExistsException(RoleAlreadyExistsException ex) {
        log.warn("Role already exists: {}", ex.getMessage());

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("CONFLICT")
            .responseMessage(ex.getMessage())
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        log.warn("Invalid credentials");

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("UNAUTHORIZED")
            .responseMessage("Email o contraseña incorrectos")
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {
        log.error("Unexpected error", ex);

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("ERROR")
            .responseMessage("Ha ocurrido un error interno del servidor")
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
