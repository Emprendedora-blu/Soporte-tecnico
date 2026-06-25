package com.empresa.soportetecnico.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
