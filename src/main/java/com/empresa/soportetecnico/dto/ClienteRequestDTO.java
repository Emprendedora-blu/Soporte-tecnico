package com.empresa.soportetecnico.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
DTO utilizado para crear o actualizar un cliente a traves de la API.
Separa los datos que el cliente externo envia (request) del modelo
de dominio interno, y aplica validaciones sobre los datos de entrada.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDTO {

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String nombre;

    @NotBlank(message = "El correo del cliente es obligatorio")
    @Email(message = "El correo del cliente debe tener un formato valido")
    private String correo;

    private String telefono;

    private String empresa;
}
