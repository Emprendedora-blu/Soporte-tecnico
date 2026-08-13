package com.zegel.users.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
