package com.zegel.users.users.controller;

import com.zegel.users.users.dto.ApiResponse;
import com.zegel.users.users.dto.CreateUserRequest;
import com.zegel.users.users.dto.LoginRequest;
import com.zegel.users.users.dto.LoginResponse;
import com.zegel.users.users.dto.UserResponse;
import com.zegel.users.users.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse data = authService.login(request);

        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Inicio de sesión exitoso")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody CreateUserRequest request) {
        UserResponse data = authService.registrarPublico(request);

        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Usuario creado exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
