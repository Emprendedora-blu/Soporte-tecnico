package com.empresa.soportetecnico;

import com.empresa.soportetecnico.dto.SolicitudRequestDTO;
import com.empresa.soportetecnico.exception.RecursoNoEncontradoException;
import com.empresa.soportetecnico.exception.SolicitudInvalidaException;
import com.empresa.soportetecnico.model.Cliente;
import com.empresa.soportetecnico.model.EstadoSolicitud;
import com.empresa.soportetecnico.model.Solicitud;
import com.empresa.soportetecnico.service.ClienteService;
import com.empresa.soportetecnico.service.ClienteServiceImpl;
import com.empresa.soportetecnico.service.SolicitudService;
import com.empresa.soportetecnico.service.SolicitudServiceImpl;
import com.empresa.soportetecnico.service.TecnicoService;
import com.empresa.soportetecnico.service.TecnicoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SolicitudServiceTest {

    private SolicitudService solicitudService;
    private ClienteService clienteService;
    private TecnicoService tecnicoService;
    private Cliente clientePrueba;

    @BeforeEach
    void configurar() {
        clienteService = new ClienteServiceImpl();
        tecnicoService = new TecnicoServiceImpl();
        solicitudService = new SolicitudServiceImpl(clienteService, tecnicoService);

        clientePrueba = clienteService.crear(
                Cliente.builder()
                        .nombre("Josue Riveros")
                        .correo("josueriveros@idat.pe")
                        .telefono("963459821")
                        .empresa("Comercial Riveros S.A.C.")
                        .build()
        );
    }

    @Test
    void debeCrearSolicitudConEstadoPendientePorDefecto() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTitulo("No enciende la impresora");
        dto.setDescripcion("La impresora de red no responde desde esta mañana");
        dto.setPrioridad("ALTA");
        dto.setClienteId(clientePrueba.getId());

        Solicitud solicitud = solicitudService.crear(dto);

        assertNotNull(solicitud.getId());
        assertEquals(EstadoSolicitud.PENDIENTE, solicitud.getEstado());
        assertEquals(clientePrueba.getId(), solicitud.getCliente().getId());
    }

    @Test
    void debeLanzarExcepcionSiLaPrioridadNoEsValida() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTitulo("Error de login");
        dto.setDescripcion("El usuario no puede acceder al sistema");
        dto.setPrioridad("URGENTISIMA"); // valor invalido
        dto.setClienteId(clientePrueba.getId());

        assertThrows(SolicitudInvalidaException.class, () -> solicitudService.crear(dto));
    }

    @Test
    void debeLanzarExcepcionSiElClienteNoExiste() {
        SolicitudRequestDTO dto = new SolicitudRequestDTO();
        dto.setTitulo("Falla de red");
        dto.setDescripcion("No hay conexion a internet en la sucursal");
        dto.setPrioridad("MEDIA");
        dto.setClienteId(999L); // id inexistente

        assertThrows(RecursoNoEncontradoException.class, () -> solicitudService.crear(dto));
    }

    @Test
    void debeLanzarExcepcionAlBuscarSolicitudInexistente() {
        assertThrows(RecursoNoEncontradoException.class, () -> solicitudService.buscarPorId(123L));
    }
}
