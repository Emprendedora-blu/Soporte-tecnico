package com.empresa.soportetecnico.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 *Representa una solicitud de soporte tecnico registrada por un cliente.
 Es la entidad central del dominio: agrupa la informacion del cliente
 que reporta el problema, el tecnico que la atiende (si ya fue asignado),
 su estado actual y su prioridad. Se simula su persistencia en una
 coleccion en memoria dentro de la capa de servicio.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    private Long id;
    private String titulo;
    private String descripcion;
    private EstadoSolicitud estado;
    private PrioridadSolicitud prioridad;
    private Cliente cliente;
    private Tecnico tecnicoAsignado;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm")
    private LocalDateTime fechaCreacion;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm")
    private LocalDateTime fechaActualizacion;
}
