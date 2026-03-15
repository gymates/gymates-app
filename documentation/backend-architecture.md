# Backend Architecture Guide

This guide defines how we structure the Spring Boot backend with Clean Architecture and Hexagonal/Onion principles, applying DDD and lightweight CQRS. It aligns with the requested split:

- infrastructure
  - inbound (web, mobile)
  - outbound
- application
  - <feature> (e.g., auth, group, chat)
- domain
  - <feature> (e.g., auth, group, chat)

Treat this as a living document—opt for simplicity first and grow only when the domain demands it (YAGNI, KISS). Security-first: see `.github/instructions/security-and-owasp.instructions.md`.

## Goals

- Business-first design with clear, testable domain models
- Maintainability via clear boundaries and explicit contracts
- Replaceable infrastructure (DB, messaging, external APIs) with ports/adapters
- Predictable flows (commands/queries) and fast tests at the right layers

## Layers and dependencies

- Infrastructure
  - Inbound adapters: HTTP controllers for web/mobile, mapping requests to application commands/queries
  - Outbound adapters: implementations for persistence, messaging, external clients, configuration
- Application: use cases (command/query handlers), transactions, orchestration; depends only on Domain and outbound ports
- Domain (core): entities, value objects, aggregates, domain services, domain events

Dependency rule: Infrastructure ➜ Application ➜ Domain (pointing inward). Inbound calls go from adapters into application; outbound calls go from application through ports to infrastructure adapters.

## Suggested base package structure

Base package: `io.github.gymates`

- `infrastructure/`
  - `inbound/web/<feature>`: REST controllers, request/response DTOs, exception mapping for web
  - `inbound/mobile/<feature>`: controllers for mobile-specific endpoints (if different)
  - `outbound/persistence/jpa/<feature>`: JPA entities/mappers, Spring Data repositories implementing outbound ports
  - `outbound/client/<feature>`: HTTP clients, DTOs, mappers
  - `config`: infrastructure configs (DB, Flyway, security filters, serialization)
- `application/`
  - `<feature>/command|query`: request models for use cases
  - `<feature>/handler`: command/query handlers (transactional boundary)
  - `<feature>/port/out`: outbound ports (interfaces) the application requires
  - `<feature>/dto`: application-level DTOs (optional)
- `domain/`
  - `<feature>/model`: entities, value objects, aggregates (framework-agnostic)
  - `<feature>/service`: domain services
  - `<feature>/event`: domain events
  - `<feature>/repository`: optional domain repository abstractions (if you keep ports in domain)

> Feature examples: `auth`, `user`, `group`, `chat`, `plan`, `nutrition`. Start in a single module; split modules only when needed.

## DDD building blocks

- Entities and Value Objects: behavior with data; immutable VOs validated at construction
- Aggregates: enforce invariants; expose intention-revealing methods
- Domain Services: stateless business operations beyond a single aggregate
- Domain Events: capture significant changes; optionally publish to messaging from adapters
- Repositories/Ports: abstractions to load/persist aggregates (define in application `port/out` or domain `repository`)

### Validation and invariants

- Validate at inbound adapters (Bean Validation) and enforce invariants in domain
- Fail fast with meaningful errors; map to consistent API error format

## Ports & Adapters

- Outbound ports are interfaces under `application/<feature>/port/out` (or domain repository abstractions)
- Adapters in `infrastructure/outbound/...` implement those ports using JPA/HTTP/etc.
- Inbound adapters in `infrastructure/inbound/...` depend on application only

## CQRS (pragmatic)

- Separate commands (state change) and queries (reads) at application level
- Handlers are cohesive, transactional units; return minimal results/IDs
- Read models can be denormalized DTOs or projections when performance dictates

## API and DTO contracts

- Keep API DTOs within inbound web/mobile packages; do not leak JPA entities
- Map between layers explicitly (manual or MapStruct)
- Version public APIs (e.g., `/api/v1/...`) and centralize exception handling

## Testing strategy

- Domain unit tests: pure, fast, deterministic
- Application tests: handlers with in-memory fakes for ports
- Spring slices:
  - `@WebMvcTest` for controllers (mock handlers)
  - `@DataJpaTest` for persistence adapters
- Integration tests: happy-path wiring (Testcontainers recommended for DB)
- Contract tests where appropriate

## Conventions checklist

- Controllers thin; no transactions
- Handlers hold transactions; idempotency where applicable
- Domain framework-agnostic; invariants enforced
- Outbound dependencies via ports; adapters implement them
- Commands vs. queries separated; no JPA entities in API
- Centralized error handling; structured logging without secrets/PII

## Example layout (auth)

```
io/github/gymates/
  infrastructure/
    inbound/web/auth/
      RegisterController.java
      dto/
        RegisterRequest.java
        RegisterResponse.java
      ApiExceptionHandler.java
    outbound/persistence/jpa/auth/
      UserJpaEntity.java
      UserJpaRepository.java
      UserRepositoryAdapter.java  // implements application port
  application/
    auth/
      command/RegisterUserCommand.java
      handler/RegisterUserHandler.java
      port/out/UserRepositoryPort.java
  domain/
    auth/
      model/User.java
      event/UserRegistered.java
      service/PasswordPolicy.java
  common/
    error/ErrorCodes.java
    time/ClockProvider.java
```

This repository currently holds some files under previous paths. New code should follow the structure above; existing code can be incrementally moved when touched.

## References

- Clean Architecture – R. C. Martin
- Implementing Domain-Driven Design – V. Vernon
- Hexagonal Architecture – A. Cockburn
