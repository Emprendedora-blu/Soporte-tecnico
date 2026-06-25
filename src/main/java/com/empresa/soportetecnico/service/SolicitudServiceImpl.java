package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.dto.SolicitudRequestDTO;
import com.empresa.soportetecnico.dto.SolicitudUpdateDTO;
import com.empresa.soportetecnico.exception.RecursoNoEncontradoException;
import com.empresa.soportetecnico.exception.SolicitudInvalidaException;
import com.empresa.soportetecnico.model.Cliente;
import com.empresa.soportetecnico.model.EstadoSolicitud;
import com.empresa.soportetecnico.model.PrioridadSolicitud;
import com.empresa.soportetecnico.model.Solicitud;
import com.empresa.soportetecnico.model.Tecnico;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/*
 Implementacion de SolicitudService.
 Controla toda la logica de manipulacion de las solicitudes de soporte:
 valida los datos relacionados
 */
@Service
public class SolicitudServiceImpl implements SolicitudService {

    private final Map<Long, Solicitud> solicitudes = new ConcurrentHashMap<>();
    private final AtomicLong contadorId = new AtomicLong(0);

    private final ClienteService clienteService;
    private final TecnicoService tecnicoService;

    public SolicitudServiceImpl(ClienteService clienteService, TecnicoService tecnicoService) {
        this.clienteService = clienteService;
        this.tecnicoService = tecnicoService;
    }

    @Override
    public List<Solicitud> listarTodas() {
        return List.copyOf(solicitudes.values());
    }

    @Override
    public List<Solicitud> listarPorEstado(String estado) {
        EstadoSolicitud estadoEnum = convertirEstado(estado);
        return solicitudes.values().stream()
                .filter(s -> s.getEstado() == estadoEnum)
                .collect(Collectors.toList());
    }

    @Override
    public Solicitud buscarPorId(Long id) {
        Solicitud solicitud = solicitudes.get(id);
        if (solicitud == null) {
            throw new RecursoNoEncontradoException("No se encontro una solicitud con id " + id);
        }
        return solicitud;
    }

    @Override
    public Solicitud crear(SolicitudRequestDTO dto) {
        Cliente cliente = clienteService.buscarPorId(dto.getClienteId());

        Tecnico tecnicoAsignado = null;
        if (dto.getTecnicoId() != null) {
            tecnicoAsignado = tecnicoService.buscarPorId(dto.getTecnicoId());
        }

        PrioridadSolicitud prioridad = convertirPrioridad(dto.getPrioridad());
        LocalDateTime ahora = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

        Solicitud nuevaSolicitud = Solicitud.builder()
                .id(contadorId.incrementAndGet())
                .titulo(dto.getTitulo())
                .descripcion(dto.getDescripcion())
                .prioridad(prioridad)
                .estado(EstadoSolicitud.PENDIENTE)
                .cliente(cliente)
                .tecnicoAsignado(tecnicoAsignado)
                .fechaCreacion(ahora)
                .fechaActualizacion(ahora)
                .build();

        solicitudes.put(nuevaSolicitud.getId(), nuevaSolicitud);
        return nuevaSolicitud;
    }

    @Override
    public Solicitud actualizar(Long id, SolicitudUpdateDTO dto) {
        Solicitud solicitudExistente = buscarPorId(id);

        if (dto.getTitulo() != null && !dto.getTitulo().isBlank()) {
            solicitudExistente.setTitulo(dto.getTitulo());
        }
        if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
            solicitudExistente.setDescripcion(dto.getDescripcion());
        }
        if (dto.getPrioridad() != null) {
            solicitudExistente.setPrioridad(convertirPrioridad(dto.getPrioridad()));
        }
        if (dto.getEstado() != null) {
            solicitudExistente.setEstado(convertirEstado(dto.getEstado()));
        }
        if (dto.getTecnicoId() != null) {
            Tecnico tecnico = tecnicoService.buscarPorId(dto.getTecnicoId());
            solicitudExistente.setTecnicoAsignado(tecnico);
        }

        solicitudExistente.setFechaActualizacion(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        solicitudes.put(id, solicitudExistente);
        return solicitudExistente;
    }

    @Override
    public Solicitud asignarTecnico(Long id, Long tecnicoId) {
        Solicitud solicitud = buscarPorId(id);

        if (solicitud.getEstado() == EstadoSolicitud.RESUELTA || solicitud.getEstado() == EstadoSolicitud.CANCELADA) {
            throw new SolicitudInvalidaException(
                    "No se puede asignar un tecnico a una solicitud en estado " + solicitud.getEstado());
        }

        Tecnico tecnico = tecnicoService.buscarPorId(tecnicoId);
        solicitud.setTecnicoAsignado(tecnico);
        solicitud.setFechaActualizacion(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        solicitudes.put(id, solicitud);
        return solicitud;
    }

    @Override
    public Solicitud actualizarEstado(Long id, String nuevoEstado) {
        Solicitud solicitud = buscarPorId(id);
        EstadoSolicitud estadoActual = solicitud.getEstado();
        EstadoSolicitud estadoNuevo = convertirEstado(nuevoEstado);

        validarTransicionEstado(estadoActual, estadoNuevo);

        solicitud.setEstado(estadoNuevo);
        solicitud.setFechaActualizacion(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        solicitudes.put(id, solicitud);
        return solicitud;
    }

    @Override
    public void eliminar(Long id) {
        buscarPorId(id);
        solicitudes.remove(id);
    }

    private void validarTransicionEstado(EstadoSolicitud actual, EstadoSolicitud nuevo) {
        boolean valida = switch (actual) {
            case PENDIENTE -> nuevo == EstadoSolicitud.EN_PROCESO || nuevo == EstadoSolicitud.CANCELADA;
            case EN_PROCESO -> nuevo == EstadoSolicitud.RESUELTA || nuevo == EstadoSolicitud.CANCELADA;
            case RESUELTA, CANCELADA -> false;
        };

        if (!valida) {
            throw new SolicitudInvalidaException(
                    "Transicion de estado invalida: no se puede pasar de " + actual + " a " + nuevo +
                    ". Transiciones validas: PENDIENTE -> EN_PROCESO | CANCELADA, EN_PROCESO -> RESUELTA | CANCELADA");
        }
    }

    private PrioridadSolicitud convertirPrioridad(String valor) {
        try {
            return PrioridadSolicitud.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new SolicitudInvalidaException(
                    "La prioridad '" + valor + "' no es valida. Valores permitidos: BAJA, MEDIA, ALTA, CRITICA");
        }
    }

    private EstadoSolicitud convertirEstado(String valor) {
        try {
            return EstadoSolicitud.valueOf(valor.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new SolicitudInvalidaException(
                    "El estado '" + valor + "' no es valido. Valores permitidos: PENDIENTE, EN_PROCESO, RESUELTA, CANCELADA");
        }
    }
}
