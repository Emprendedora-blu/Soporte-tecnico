package com.empresa.soportetecnico.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 Representa al cliente que reporta una solicitud de soporte tecnico.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private String empresa;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm")
    private LocalDateTime fechaRegistro;
}
