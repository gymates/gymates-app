---
description: 'Guidelines for building Spring Boot base applications'
applyTo: '**/*.java, **/*.kt'
---

# Spring Boot Development

## General Instructions

- Make only high confidence suggestions when reviewing code changes.
- Write code with good maintainability practices, including comments on why certain design decisions were made.
- Handle edge cases and write clear exception handling.
- For libraries or external dependencies, mention their usage and purpose in comments.

## Spring Boot Instructions

### Backend Architecture (Clean, DDD, Hexagonal/Onion)

- Layering (Clean Architecture)
  - Domain: Entities, Value Objects, Domain Services, Domain Events (no framework dependencies).
  - Application: Use cases orchestrating domain; input/output ports; DTOs; no infrastructure details.
  - Interfaces (Inbound Adapters): REST controllers, schedulers, CLI mapping requests to use cases.
  - Infrastructure (Outbound Adapters): Persistence, messaging, external APIs implementing ports.
  - Rule: dependencies point inward; inner layers do not depend on outer layers.
- DDD Essentials
  - Ubiquitous Language within bounded contexts; keep models context-specific.
  - Aggregates enforce invariants and transactional boundaries; modify via aggregate roots.
  - Publish domain events for significant state changes and handle them in application/integration layers.
  - Repositories abstract persistence and return domain objects (not ORM entities outside infra).
- Hexagonal/Onion
  - Define ports for required and provided capabilities at the boundary.
  - Implement adapters (DB, HTTP clients, message brokers) behind those ports for replaceable edges.
  - Prefer composition and configuration to swap infrastructure with minimal changes.

### Dependency Injection

- Use constructor injection for all required dependencies.
- Declare dependency fields as `private final`.

### Configuration

- Use YAML files (`application.yml`) for externalized configuration.
- Environment Profiles: Use Spring profiles for different environments (dev, test, prod)
- Configuration Properties: Use @ConfigurationProperties for type-safe configuration binding
- Secrets Management: Externalize secrets using environment variables or secret management systems

### Code Organization

- Package Structure: Organize by feature/domain rather than by layer
- Separation of Concerns: Keep controllers thin, services focused, and repositories simple
- Utility Classes: Make utility classes final with private constructors

### Service Layer

- Place business logic in `@Service`-annotated classes.
- Services should be stateless and testable.
- Inject repositories via the constructor.
- Service method signatures should use domain IDs or DTOs, not expose repository entities directly unless necessary.

### CQRS (Command/Query Responsibility Segregation)

- Applicability: CQRS is a backend concern. We separate write paths (Commands) from read paths (Queries).
- Principles
  - Commands change state; Queries never change state. Do not mix them in a single handler.
  - Commands should be idempotent (use an idempotency key/correlation ID where appropriate).
  - Clear transactional boundaries at handler/use-case level (`@Transactional` for Commands; Queries are read-only).
  - Queries return projections/DTOs optimized for the UI. Do not expose domain entities directly.
  - Emit domain events after successful Commands and project them into read models (eventual consistency). Consider the Outbox pattern.
  - Apply access control on both sides (least privilege, deny-by-default per OWASP).
- Package organization (example):
  - `...application.command` (DTO + handler)
  - `...application.query` (DTO + handler)
  - `...interfaces` (separate controllers for Commands and Queries)
- Testing
  - Commands: test invariants, idempotency, emitted events, and transactional effects.
  - Queries: test projections (correctness, pagination/filters) and query performance.

### Logging

- Use SLF4J for all logging (`private static final Logger logger = LoggerFactory.getLogger(MyClass.class);`).
- Do not use concrete implementations (Logback, Log4j2) or `System.out.println()` directly.
- Use parameterized logging: `logger.info("User {} logged in", userId);`.

### Security & Input Handling

- Use parameterized queries | Always use Spring Data JPA or `NamedParameterJdbcTemplate` to prevent SQL injection.
- Validate request bodies and parameters using JSR-380 (`@NotNull`, `@Size`, etc.) annotations and `BindingResult`

## Build and Verification

- After adding or modifying code, verify the project continues to build successfully.
- If the project uses Maven, run `mvn clean install`.
- If the project uses Gradle, run `./gradlew build` (or `gradlew.bat build` on Windows).
- Ensure all tests pass as part of the build.
