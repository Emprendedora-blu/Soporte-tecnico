package com.zegel.users.users.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AppException {

    public InvalidCredentialsException() {
        super(
            "Email o contraseña inválidos",
            HttpStatus.UNAUTHORIZED,
            "INVALID_CREDENTIALS"
        );
    }
}
