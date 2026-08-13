# Soporte Tecnico

Monorepo del sistema de gestion de solicitudes de soporte tecnico. Contiene los microservicios backend y el frontend (Angular).

## Estructura

- [`backend/soporte-tecnico-api`](backend/soporte-tecnico-api) — API RESTful en Java 17 + Spring Boot 3 (Solicitudes, Clientes, Tecnicos). Puerto 8081.
- [`backend/ms-users-main`](backend/ms-users-main) — Microservicio de usuarios, autenticacion y roles (Spring Security + JWT). Puerto 8082.
- `frontend/` — Aplicacion Angular (interfaz web para clientes, tecnicos y administradores).

Cada carpeta tiene su propio README con instrucciones especificas de instalacion y ejecucion.

## Configuracion antes de ejecutar el backend

Ambos microservicios necesitan un `application.properties` local (no versionado, contiene credenciales):

1. En cada carpeta de backend, copia `src/main/resources/application.properties.example` a `src/main/resources/application.properties`.
2. Reemplaza los valores `CHANGE_ME` con tus credenciales reales de MySQL y una clave JWT propia.
3. `jwt.secret-key` debe ser **identico** en `soporte-tecnico-api` y `ms-users-main` (ambos validan el mismo token).

`application.properties` esta en `.gitignore` en ambos proyectos: nunca se sube al repositorio.
