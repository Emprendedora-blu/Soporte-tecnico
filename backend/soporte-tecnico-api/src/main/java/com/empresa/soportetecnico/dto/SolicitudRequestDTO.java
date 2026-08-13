package com.empresa.soportetecnico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
DTO utilizado para registrar una nueva solicitud de soporte tecnico.
El cliente se referencia por su id (clienteId), ya que debe existir
previamente en el sistema. El tecnico es opcional al momento de crear
la solicitud, dado que puede asignarse mas adelante.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRequestDTO {

    @NotBlank(message = "El titulo de la solicitud es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripcion de la solicitud es obligatoria")
    private String descripcion;

    @NotNull(message = "La prioridad de la solicitud es obligatoria")
    private String prioridad;

    @NotNull(message = "El id del cliente que reporta la solicitud es obligatorio")
    private Long clienteId;

    private Long tecnicoId;
}
