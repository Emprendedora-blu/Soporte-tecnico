package com.empresa.soportetecnico.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
