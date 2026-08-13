# README.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot 4.1.0 microservice for user management, written in Java 17. It's part of the larger IDAT backend system and uses Maven for build management.

**Key Stack:**
- Spring Boot 4.1.0 with Spring Data JPA and Spring Security
- MySQL database via JDBC connector
- Java 17 (verify with `javac -version`)

## Build and Run Commands

### Build
```bash
./mvnw clean package          # Full build with tests
./mvnw clean package -DskipTests  # Skip tests
./mvnw compile                # Just compile
```

### Run
```bash
./mvnw spring-boot:run        # Run the application
```

### Tests
```bash
./mvnw test                   # Run all tests
./mvnw test -Dtest=UsersApplicationTests  # Run specific test
```

### Package
```bash
./mvnw verify                 # Verify integrity
./mvnw install                # Build to local repo
```

## Project Structure

**Source Layout:**
- `src/main/java/com/zegel/users/users/` - Main application code (start here: `UsersApplication.java`)
- `src/main/resources/` - Configuration and static assets
  - `application.properties` - Spring Boot configuration
- `src/test/java/com/zegel/users/users/` - Test suites

**Config:**
- `pom.xml` - Maven dependencies and build configuration
- `.mvn/` - Maven wrapper configuration

## Architecture Notes

This is a greenfield Spring Boot application. Key components to establish as you add functionality:

- **Controllers**: REST endpoints should go in a `controller/` package
- **Services**: Business logic in a `service/` package with `@Service` stereotype
- **Repositories**: JPA repositories in a `repository/` package extending `JpaRepository`
- **Entities**: JPA entities in a `model/` package with `@Entity` annotations
- **Security**: Configure in a `config/SecurityConfig.java` (Spring Security is included)

The application is configured to use MySQL at runtime. Ensure database connection properties are set in `application.properties` or `application-{profile}.properties` files before deploying.

## Common Development Workflow

1. Create entities in `model/` with JPA annotations
2. Create repositories extending `JpaRepository` in `repository/`
3. Create service classes in `service/` with `@Service` and `@Transactional` where needed
4. Expose endpoints via controllers in `controller/` with `@RestController` and `@RequestMapping`
5. Add validation with `spring-boot-starter-validation` constraints
6. Write tests in parallel under `src/test/java/`

Use `./mvnw spring-boot:run` to test changes interactively during development.
