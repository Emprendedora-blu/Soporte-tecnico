package com.empresa.soportetecnico.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
DTO utilizado para crear o actualizar un tecnico a traves de la API.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TecnicoRequestDTO {

    @NotBlank(message = "El nombre del tecnico es obligatorio")
    private String nombre;

    @NotBlank(message = "El correo del tecnico es obligatorio")
    @Email(message = "El correo del tecnico debe tener un formato valido")
    private String correo;

    @NotBlank(message = "La especialidad del tecnico es obligatoria")
    private String especialidad;
}
