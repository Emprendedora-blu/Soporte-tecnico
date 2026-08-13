package com.zegel.users.users.service;

import com.zegel.users.users.dto.CreateRoleRequest;
import com.zegel.users.users.dto.RoleResponse;
import com.zegel.users.users.exception.ResourceNotFoundException;
import com.zegel.users.users.exception.RoleAlreadyExistsException;
import com.zegel.users.users.model.Role;
import com.zegel.users.users.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new RoleAlreadyExistsException(request.getName());
        }

        Role role = Role.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();

        Role savedRole = roleRepository.save(role);
        log.info("Role created: {}", savedRole.getName());

        return mapToRoleResponse(savedRole);
    }

    @Transactional(readOnly = true)
    public RoleResponse getRoleById(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", String.valueOf(id)));

        return mapToRoleResponse(role);
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(this::mapToRoleResponse)
            .toList();
    }

    @Transactional
    public RoleResponse updateRole(Long id, CreateRoleRequest request) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", String.valueOf(id)));

        if (!role.getName().equals(request.getName()) &&
            roleRepository.findByName(request.getName()).isPresent()) {
            throw new RoleAlreadyExistsException(request.getName());
        }

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        Role updatedRole = roleRepository.save(role);
        log.info("Role updated: {}", updatedRole.getName());

        return mapToRoleResponse(updatedRole);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", String.valueOf(id)));

        roleRepository.delete(role);
        log.info("Role deleted: {}", role.getName());
    }

    private RoleResponse mapToRoleResponse(Role role) {
        return RoleResponse.builder()
            .id(role.getId())
            .name(role.getName())
            .description(role.getDescription())
            .fechaCreacion(role.getFechaCreacion())
            .fechaActualizacion(role.getFechaActualizacion())
            .build();
    }
}
