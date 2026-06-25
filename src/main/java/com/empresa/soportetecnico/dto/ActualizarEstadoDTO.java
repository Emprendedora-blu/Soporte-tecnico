package com.empresa.soportetecnico.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarEstadoDTO {

    @NotBlank(message = "El estado es obligatorio")
    private String estado;
}
