package com.empresa.soportetecnico.controller;

import com.empresa.soportetecnico.common.ApiResponse;
import com.empresa.soportetecnico.common.ApiResponseUtil;
import com.empresa.soportetecnico.dto.SolicitudRequestDTO;
import com.empresa.soportetecnico.dto.SolicitudUpdateDTO;
import com.empresa.soportetecnico.model.Solicitud;
import com.empresa.soportetecnico.service.SolicitudService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
Expone los endpoints CRUD para la gestion de solicitudes de soporte
tecnico, el recurso central de la API.
Base de la ruta: /api/solicitudes
Incluye una ruta jerarquica adicional para filtrar solicitudes por
estado: /api/solicitudes/estado/{estado}
 */

@RestController
@RequestMapping("/api/solicitudes")
@Tag(name = "Solicitudes", description = "Registro, consulta, actualizacion y eliminacion de solicitudes de soporte tecnico")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @Operation(summary = "Listar todas las solicitudes de soporte registradas")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Solicitud>>> listarTodas() {
        List<Solicitud> solicitudes = solicitudService.listarTodas();
        return ResponseEntity.ok(ApiResponseUtil.success("Solicitudes obtenidas correctamente", solicitudes));
    }

    @Operation(summary = "Listar solicitudes filtradas por estado (PENDIENTE, EN_PROCESO, RESUELTA, CANCELADA)")
    @GetMapping("/estado/{estado}")
    public ResponseEntity<ApiResponse<List<Solicitud>>> listarPorEstado(
            @Parameter(description = "Estado de la solicitud") @PathVariable String estado) {
        List<Solicitud> solicitudes = solicitudService.listarPorEstado(estado);
        return ResponseEntity.ok(ApiResponseUtil.success("Solicitudes filtradas por estado '" + estado + "'", solicitudes));
    }

    @Operation(summary = "Obtener una solicitud de soporte por su id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Solicitud>> buscarPorId(@PathVariable Long id) {
        Solicitud solicitud = solicitudService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Solicitud encontrada", solicitud));
    }

    @Operation(summary = "Registrar una nueva solicitud de soporte tecnico")
    @PostMapping
    public ResponseEntity<ApiResponse<Solicitud>> crear(@Valid @RequestBody SolicitudRequestDTO dto) {
        Solicitud solicitudCreada = solicitudService.crear(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseUtil.success("Solicitud registrada correctamente", solicitudCreada));
    }

    @Operation(summary = "Actualizar una solicitud existente (titulo, descripcion, prioridad, estado o tecnico asignado)")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Solicitud>> actualizar(
            @PathVariable Long id, @Valid @RequestBody SolicitudUpdateDTO dto) {
        Solicitud solicitudActualizada = solicitudService.actualizar(id, dto);
        return ResponseEntity.ok(ApiResponseUtil.success("Solicitud actualizada correctamente", solicitudActualizada));
    }

    @Operation(summary = "Eliminar una solicitud de soporte por su id")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        solicitudService.eliminar(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Solicitud eliminada correctamente", null));
    }
}
