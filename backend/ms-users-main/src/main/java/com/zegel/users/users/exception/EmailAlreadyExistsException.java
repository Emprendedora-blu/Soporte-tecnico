package com.zegel.users.users.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends AppException {

    public EmailAlreadyExistsException(String email) {
        super(
            String.format("El email %s ya está registrado", email),
            HttpStatus.CONFLICT,
            "EMAIL_ALREADY_EXISTS"
        );
    }
}
