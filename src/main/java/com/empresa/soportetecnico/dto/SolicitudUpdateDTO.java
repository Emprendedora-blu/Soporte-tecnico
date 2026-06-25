package com.empresa.soportetecnico.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
DTO utilizado para actualizar una solicitud existente: permite cambiar
titulo, descripcion, prioridad, estado y reasignar tecnico.
Todos los campos son opcionales; solo se actualizan los que llegan
informados (actualizacion parcial tipo PATCH/PUT flexible).
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudUpdateDTO {

    private String titulo;
    private String descripcion;
    private String prioridad;
    private String estado;
    private Long tecnicoId;
}
