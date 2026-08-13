package com.empresa.soportetecnico.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsignarTecnicoDTO {

    @NotNull(message = "El id del tecnico es obligatorio")
    private Long tecnicoId;
}
