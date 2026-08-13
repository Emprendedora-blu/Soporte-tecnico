package com.zegel.users.users.exception;

import org.springframework.http.HttpStatus;

public class RoleAlreadyExistsException extends AppException {

    public RoleAlreadyExistsException(String roleName) {
        super(
            String.format("El rol '%s' ya existe", roleName),
            HttpStatus.CONFLICT,
            "ROLE_ALREADY_EXISTS"
        );
    }
}
