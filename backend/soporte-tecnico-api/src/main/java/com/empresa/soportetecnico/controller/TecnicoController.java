package com.empresa.soportetecnico.controller;

import com.empresa.soportetecnico.common.ApiResponse;
import com.empresa.soportetecnico.common.ApiResponseUtil;
import com.empresa.soportetecnico.dto.TecnicoRequestDTO;
import com.empresa.soportetecnico.model.Tecnico;
import com.empresa.soportetecnico.service.TecnicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
Expone los endpoints CRUD para la gestion de tecnicos de soporte.
Base de la ruta: /api/tecnicos
 */
@RestController
@RequestMapping("/api/tecnicos")
@Tag(name = "Tecnicos", description = "Gestion de los tecnicos que atienden las solicitudes de soporte")
public class TecnicoController {

    private final TecnicoService tecnicoService;

    public TecnicoController(TecnicoService tecnicoService) {
        this.tecnicoService = tecnicoService;
    }

    @Operation(summary = "Listar todos los tecnicos registrados")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tecnico>>> listarTodos() {
        List<Tecnico> tecnicos = tecnicoService.listarTodos();
        return ResponseEntity.ok(ApiResponseUtil.success("Tecnicos obtenidos correctamente", tecnicos));
    }

    @Operation(summary = "Obtener un tecnico por su id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tecnico>> buscarPorId(@PathVariable Long id) {
        Tecnico tecnico = tecnicoService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Tecnico encontrado", tecnico));
    }

    @Operation(summary = "Registrar un nuevo tecnico")
    @PostMapping
    public ResponseEntity<ApiResponse<Tecnico>> crear(@Valid @RequestBody TecnicoRequestDTO dto) {
        Tecnico tecnico = Tecnico.builder()
                .nombre(dto.getNombre())
                .correo(dto.getCorreo())
                .especialidad(dto.getEspecialidad())
                .build();

        Tecnico tecnicoCreado = tecnicoService.crear(tecnico);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseUtil.success("Tecnico registrado correctamente", tecnicoCreado));
    }

    @Operation(summary = "Actualizar los datos de un tecnico existente")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Tecnico>> actualizar(
            @PathVariable Long id, @Valid @RequestBody TecnicoRequestDTO dto) {

        Tecnico datosActualizados = Tecnico.builder()
                .nombre(dto.getNombre())
                .correo(dto.getCorreo())
                .especialidad(dto.getEspecialidad())
                .build();

        Tecnico tecnicoActualizado = tecnicoService.actualizar(id, datosActualizados);
        return ResponseEntity.ok(ApiResponseUtil.success("Tecnico actualizado correctamente", tecnicoActualizado));
    }

    @Operation(summary = "Eliminar un tecnico por su id")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        tecnicoService.eliminar(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Tecnico eliminado correctamente", null));
    }
}
