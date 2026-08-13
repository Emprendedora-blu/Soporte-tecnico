# API de Solicitudes de Soporte Tecnico

API RESTful desarrollada con **Java 17** y **Spring Boot 3** para registrar, consultar, actualizar y eliminar solicitudes de soporte tecnico de una empresa de servicios tecnologicos, sustituyendo el registro en papel o en correos desordenados.

Proyecto desarrollado para la unidad didactica **Desarrollo de los Componentes del Negocio**.

## Equipo de desarrollo

| Integrante | Rol |
|---|---|
| [Nombre integrante 1] | [Rol: ej. Backend - Modelado y capa de servicio] |
| [Nombre integrante 2] | [Rol: ej. Backend - Controladores REST y validaciones] |
| [Nombre integrante 3] | [Rol: ej. QA - Pruebas Postman, documentacion y despliegue] |

> Completar esta tabla con los nombres reales del equipo antes de subir el repositorio.

## Tecnologias utilizadas

- Java 17
- Spring Boot 3.3.4 (Spring Web, Spring Validation)
- Maven
- Lombok
- springdoc-openapi (Swagger UI)
- JUnit 5 (pruebas funcionales)
- Postman (pruebas manuales de los endpoints)

## Arquitectura del proyecto

El proyecto sigue una arquitectura en capas, separada en paquetes:

```
src/main/java/com/empresa/soportetecnico/
├── SoporteTecnicoApiApplication.java   # Clase principal (arranque de Spring Boot)
├── config/
│   └── OpenApiConfig.java              # Configuracion de Swagger/OpenAPI
├── controller/                         # Capa de presentacion (endpoints REST)
│   ├── ClienteController.java
│   ├── TecnicoController.java
│   └── SolicitudController.java
├── service/                            # Capa de logica de negocio (interfaces + implementaciones)
│   ├── ClienteService.java / ClienteServiceImpl.java
│   ├── TecnicoService.java / TecnicoServiceImpl.java
│   └── SolicitudService.java / SolicitudServiceImpl.java
├── model/                              # Entidades del dominio
│   ├── Cliente.java
│   ├── Tecnico.java
│   ├── Solicitud.java
│   ├── EstadoSolicitud.java            # Enum: PENDIENTE, EN_PROCESO, RESUELTA, CANCELADA
│   └── PrioridadSolicitud.java         # Enum: BAJA, MEDIA, ALTA, CRITICA
├── dto/                                # Objetos de transferencia de datos (entrada/salida) y validaciones
│   ├── ClienteRequestDTO.java
│   ├── TecnicoRequestDTO.java
│   ├── SolicitudRequestDTO.java
│   ├── SolicitudUpdateDTO.java
│   └── ApiResponseDTO.java             # Envoltorio de respuesta estandar para toda la API
└── exception/                          # Manejo centralizado de errores
    ├── RecursoNoEncontradoException.java
    ├── SolicitudInvalidaException.java
    └── GlobalExceptionHandler.java     # @ControllerAdvice
```

### Flujo de una peticion

`Controller` recibe la peticion HTTP y valida el cuerpo con `@Valid` → delega la logica de negocio a `Service` (interfaz) → la implementacion (`ServiceImpl`) manipula los datos en estructuras en memoria (`Map`, simulando una base de datos) → el resultado se envuelve en `ApiResponseDTO` y se devuelve como JSON. Cualquier error es interceptado por `GlobalExceptionHandler` y traducido a una respuesta HTTP coherente.

### Persistencia simulada

No se utiliza base de datos. Cada `ServiceImpl` mantiene un `ConcurrentHashMap<Long, T>` en memoria con un contador atomico (`AtomicLong`) para generar los ids, simulando el comportamiento de una base de datos real durante la ejecucion de la aplicacion. Los datos se reinician cada vez que la aplicacion se detiene.

## Requisitos previos

- JDK 17 o superior instalado (`java -version`)
- Maven 3.8+ instalado (`mvn -version`), o usar el Maven Wrapper si se agrega al proyecto
- Postman (opcional, para probar los endpoints) o `curl`

## Instalacion y ejecucion

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd soporte-tecnico-api
   ```

2. Compilar el proyecto:
   ```bash
   mvn clean install
   ```

3. Ejecutar la aplicacion:
   ```bash
   mvn spring-boot:run
   ```

   La API quedara disponible en: `http://localhost:8080`

4. (Alternativa) Ejecutar el .jar generado:
   ```bash
   java -jar target/soporte-tecnico-api-1.0.0.jar
   ```

## Documentacion interactiva (Swagger)

Una vez la aplicacion este en ejecucion, la documentacion interactiva de todos los endpoints esta disponible en:

```
http://localhost:8080/swagger-ui.html
```

## Endpoints principales

### Clientes — `/api/clientes`

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/clientes` | Listar todos los clientes |
| GET | `/api/clientes/{id}` | Obtener un cliente por id |
| POST | `/api/clientes` | Registrar un cliente |
| PUT | `/api/clientes/{id}` | Actualizar un cliente |
| DELETE | `/api/clientes/{id}` | Eliminar un cliente |

### Tecnicos — `/api/tecnicos`

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/tecnicos` | Listar todos los tecnicos |
| GET | `/api/tecnicos/{id}` | Obtener un tecnico por id |
| POST | `/api/tecnicos` | Registrar un tecnico |
| PUT | `/api/tecnicos/{id}` | Actualizar un tecnico |
| DELETE | `/api/tecnicos/{id}` | Eliminar un tecnico |

### Solicitudes de soporte — `/api/solicitudes`

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/solicitudes` | Listar todas las solicitudes |
| GET | `/api/solicitudes/estado/{estado}` | Filtrar solicitudes por estado (PENDIENTE, EN_PROCESO, RESUELTA, CANCELADA) |
| GET | `/api/solicitudes/{id}` | Obtener una solicitud por id |
| POST | `/api/solicitudes` | Registrar una solicitud (estado inicial: PENDIENTE) |
| PUT | `/api/solicitudes/{id}` | Actualizar una solicitud (titulo, descripcion, prioridad, estado o tecnico asignado) |
| DELETE | `/api/solicitudes/{id}` | Eliminar una solicitud |

## Ejemplo de uso

**Crear un cliente**
```bash
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Torres","correo":"ana.torres@correo.com","telefono":"999111222","empresa":"Comercial ABC"}'
```

**Crear una solicitud de soporte**
```bash
curl -X POST http://localhost:8080/api/solicitudes \
  -H "Content-Type: application/json" \
  -d '{"titulo":"No enciende la impresora","descripcion":"La impresora de red no responde","prioridad":"ALTA","clienteId":1}'
```

**Respuesta de ejemplo**
```json
{
  "exito": true,
  "mensaje": "Solicitud registrada correctamente",
  "datos": {
    "id": 1,
    "titulo": "No enciende la impresora",
    "descripcion": "La impresora de red no responde",
    "estado": "PENDIENTE",
    "prioridad": "ALTA",
    "cliente": { "id": 1, "nombre": "Ana Torres", "correo": "ana.torres@correo.com" },
    "tecnicoAsignado": null,
    "fechaCreacion": "2026-06-24T10:30:00",
    "fechaActualizacion": "2026-06-24T10:30:00"
  },
  "timestamp": "2026-06-24T10:30:00"
}
```

## Pruebas funcionales

- **Pruebas automatizadas (JUnit 5):** ubicadas en `src/test/java/com/empresa/soportetecnico/SolicitudServiceTest.java`. Ejecutar con:
  ```bash
  mvn test
  ```
- **Pruebas manuales (Postman):** la coleccion lista para importar se encuentra en `postman/coleccion-soporte-tecnico.postman_collection.json`. Incluye casos exitosos y casos de error (validaciones, recursos inexistentes, valores invalidos de prioridad/estado).

## Manejo de errores

Todos los errores son interceptados por `GlobalExceptionHandler` (`@RestControllerAdvice`) y devueltos con codigos HTTP contextualizados:

| Situacion | Codigo HTTP |
|---|---|
| Datos de entrada invalidos (`@Valid`) | 400 Bad Request |
| Regla de negocio incumplida (prioridad/estado invalido) | 400 Bad Request |
| Recurso no encontrado (id inexistente) | 404 Not Found |
| Error inesperado del servidor | 500 Internal Server Error |

## Licencia

Proyecto academico desarrollado con fines educativos.
