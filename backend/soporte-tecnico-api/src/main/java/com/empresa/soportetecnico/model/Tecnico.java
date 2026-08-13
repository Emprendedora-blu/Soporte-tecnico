package com.empresa.soportetecnico.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
Representa al tecnico de soporte encargado de atender las
solicitudes registradas por los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tecnico {

    private Long id;
    private String nombre;
    private String correo;
    private String especialidad;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm")
    private LocalDateTime fechaRegistro;
}
