package com.zegel.users.users.service;

import com.zegel.users.users.dto.CreateUserRequest;
import com.zegel.users.users.dto.LoginRequest;
import com.zegel.users.users.dto.LoginResponse;
import com.zegel.users.users.dto.UpdateUserRequest;
import com.zegel.users.users.dto.UserResponse;
import com.zegel.users.users.exception.EmailAlreadyExistsException;
import com.zegel.users.users.exception.InvalidCredentialsException;
import com.zegel.users.users.exception.ResourceNotFoundException;
import com.zegel.users.users.model.Role;
import com.zegel.users.users.model.User;
import com.zegel.users.users.repository.RoleRepository;
import com.zegel.users.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user);
        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());

        log.info("User logged in: {}", user.getEmail());

        return LoginResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .token(token)
            .roles(roleNames)
            .build();
    }

    /**
     * Usado por el endpoint publico POST /auth/register. Ignora cualquier rol
     * que venga en el request y siempre crea la cuenta como CLIENTE, para
     * evitar que cualquiera (sin autenticacion) se autoasigne ADMIN/TECNICO.
     * Crear cuentas con otros roles requiere ser ADMIN (POST /api/v1/users).
     */
    @Transactional
    public UserResponse registrarPublico(CreateUserRequest request) {
        CreateUserRequest soloCliente = CreateUserRequest.builder()
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .password(request.getPassword())
            .roleNames(Set.of("ROLE_CLIENTE"))
            .build();

        return createUser(soloCliente);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        Set<Role> roles = request.getRoleNames().stream()
            .map(roleName -> roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role", roleName)))
            .collect(Collectors.toSet());

        User user = User.builder()
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .password(passwordEncoder.encode(request.getPassword()))
            .isActive(true)
            .roles(roles)
            .build();

        User savedUser = userRepository.save(user);
        log.info("User created: {}", savedUser.getEmail());

        return mapToUserResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listarUsuarios() {
        return userRepository.findAll().stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse actualizarUsuario(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", String.valueOf(id)));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        if (request.getRoleNames() != null && !request.getRoleNames().isEmpty()) {
            Set<Role> roles = request.getRoleNames().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", roleName)))
                .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated: {}", updatedUser.getEmail());

        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", String.valueOf(id)));

        userRepository.delete(user);
        log.info("User deleted: {}", user.getEmail());
    }

    private UserResponse mapToUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());

        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .isActive(user.getIsActive())
            .roles(roleNames)
            .fechaCreacion(user.getFechaCreacion())
            .fechaActualizacion(user.getFechaActualizacion())
            .build();
    }
}
