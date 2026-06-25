package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.dto.SolicitudRequestDTO;
import com.empresa.soportetecnico.dto.SolicitudUpdateDTO;
import com.empresa.soportetecnico.model.Solicitud;

import java.util.List;

/**
 * Define la logica de negocio disponible para la gestion de solicitudes
 * de soporte tecnico: el caso de uso central del sistema.
 */
public interface SolicitudService {

    List<Solicitud> listarTodas();

    List<Solicitud> listarPorEstado(String estado);

    Solicitud buscarPorId(Long id);

    Solicitud crear(SolicitudRequestDTO dto);

    Solicitud actualizar(Long id, SolicitudUpdateDTO dto);

    void eliminar(Long id);
}
