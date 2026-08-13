package com.zegel.users.users.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AppException {

    public ResourceNotFoundException(String resource, String identifier) {
        super(
            String.format("%s no encontrado: %s", resource, identifier),
            HttpStatus.NOT_FOUND,
            "RESOURCE_NOT_FOUND"
        );
    }
}
