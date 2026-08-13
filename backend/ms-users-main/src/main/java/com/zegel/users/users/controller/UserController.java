package com.zegel.users.users.controller;

import com.zegel.users.users.dto.ApiResponse;
import com.zegel.users.users.dto.CreateUserRequest;
import com.zegel.users.users.dto.UpdateUserRequest;
import com.zegel.users.users.dto.UserResponse;
import com.zegel.users.users.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> listar() {
        List<UserResponse> data = authService.listarUsuarios();

        ApiResponse<List<UserResponse>> response = ApiResponse.<List<UserResponse>>builder()
            .responseCode("SUCCESS")
            .responseMessage("Usuarios obtenidos correctamente")
            .data(data)
            .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> crear(@Valid @RequestBody CreateUserRequest request) {
        UserResponse data = authService.createUser(request);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Usuario creado exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> actualizar(
            @PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        UserResponse data = authService.actualizarUsuario(id, request);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Usuario actualizado correctamente")
            .data(data)
            .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> eliminar(@PathVariable Long id) {
        authService.eliminarUsuario(id);

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("SUCCESS")
            .responseMessage("Usuario eliminado correctamente")
            .data(null)
            .build();

        return ResponseEntity.ok(response);
    }
}