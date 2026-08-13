package com.zegel.users.users.controller;

import com.zegel.users.users.dto.ApiResponse;
import com.zegel.users.users.dto.CreateRoleRequest;
import com.zegel.users.users.dto.RoleResponse;
import com.zegel.users.users.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        RoleResponse data = roleService.createRole(request);

        ApiResponse<RoleResponse> response = ApiResponse.<RoleResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Rol creado exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable Long id) {
        RoleResponse data = roleService.getRoleById(id);

        ApiResponse<RoleResponse> response = ApiResponse.<RoleResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Rol obtenido exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> data = roleService.getAllRoles();

        ApiResponse<List<RoleResponse>> response = ApiResponse.<List<RoleResponse>>builder()
            .responseCode("SUCCESS")
            .responseMessage("Roles obtenidos exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
        @PathVariable Long id,
        @Valid @RequestBody CreateRoleRequest request) {

        RoleResponse data = roleService.updateRole(id, request);

        ApiResponse<RoleResponse> response = ApiResponse.<RoleResponse>builder()
            .responseCode("SUCCESS")
            .responseMessage("Rol actualizado exitosamente")
            .data(data)
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);

        ApiResponse<Object> response = ApiResponse.builder()
            .responseCode("SUCCESS")
            .responseMessage("Rol eliminado exitosamente")
            .data(null)
            .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
