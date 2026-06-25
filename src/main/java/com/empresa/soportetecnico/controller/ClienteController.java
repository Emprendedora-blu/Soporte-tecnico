package com.empresa.soportetecnico.controller;

import com.empresa.soportetecnico.common.ApiResponse;
import com.empresa.soportetecnico.common.ApiResponseUtil;
import com.empresa.soportetecnico.dto.ClienteRequestDTO;
import com.empresa.soportetecnico.model.Cliente;
import com.empresa.soportetecnico.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
Expone los endpoints CRUD para la gestion de clientes.
 */
@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Gestion de los clientes que reportan solicitudes de soporte")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Operation(summary = "Listar todos los clientes registrados")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Cliente>>> listarTodos() {
        List<Cliente> clientes = clienteService.listarTodos();
        return ResponseEntity.ok(ApiResponseUtil.success("Clientes obtenidos correctamente", clientes));
    }

    @Operation(summary = "Obtener un cliente por su id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Cliente>> buscarPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Cliente encontrado", cliente));
    }

    @Operation(summary = "Registrar un nuevo cliente")
    @PostMapping
    public ResponseEntity<ApiResponse<Cliente>> crear(@Valid @RequestBody ClienteRequestDTO dto) {
        Cliente cliente = Cliente.builder()
                .nombre(dto.getNombre())
                .correo(dto.getCorreo())
                .telefono(dto.getTelefono())
                .empresa(dto.getEmpresa())
                .build();

        Cliente clienteCreado = clienteService.crear(cliente);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseUtil.success("Cliente registrado correctamente", clienteCreado));
    }

    @Operation(summary = "Actualizar los datos de un cliente existente")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cliente>> actualizar(
            @PathVariable Long id, @Valid @RequestBody ClienteRequestDTO dto) {

        Cliente datosActualizados = Cliente.builder()
                .nombre(dto.getNombre())
                .correo(dto.getCorreo())
                .telefono(dto.getTelefono())
                .empresa(dto.getEmpresa())
                .build();

        Cliente clienteActualizado = clienteService.actualizar(id, datosActualizados);
        return ResponseEntity.ok(ApiResponseUtil.success("Cliente actualizado correctamente", clienteActualizado));
    }

    @Operation(summary = "Eliminar un cliente por su id")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.ok(ApiResponseUtil.success("Cliente eliminado correctamente", null));
    }
}
