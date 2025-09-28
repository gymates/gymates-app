# Backend Architecture Guide

This guide defines how we structure and evolve the Spring Boot backend using pragmatic, complementary principles: Clean Architecture, Onion/Hexagonal Architecture, Domain‑Driven Design (DDD), and CQRS. Treat this as a living document—opt for simplicity first and grow only when the domain demands it (YAGNI, KISS).

> Security-first: follow the Secure Coding and OWASP rules in `.github/instructions/security-and-owasp.instructions.md`.

## Goals

- Business-first design with clear, testable domain models
- Maintainability via clear boundaries and explicit contracts
- Replaceable infrastructure (DB, messaging, external APIs) with ports/adapters
- Predictable flows (commands/queries) and fast tests at the right layers

## High-level architecture (layers)

- API (inbound adapters): HTTP controllers, request/response DTOs, authentication
- Application: use cases (command/query handlers), transactions, orchestration
- Domain (center): entities, value objects, domain services, domain events
- Infrastructure (outbound adapters): persistence (JPA), messaging, external clients, configuration

Dependencies point inward only:

API ➜ Application ➜ Domain
▲ ▲
└── Infrastructure (adapters implement outbound ports)

## Package structure

Base package: `io.github.gymates`

- `api/` – inbound adapters (REST, maybe GraphQL in future)
  - `rest/<context>`: controllers, request/response DTOs, mappers
  - `config`: API-specific config, security filters, exception handling
- `application/` – orchestrates use cases (no framework logic)
  - `<context>/command|query`: DTOs describing inputs
  - `<context>/handler`: command/query handlers (transactional, idempotency)
  - `<context>/port/out`: outbound ports (interfaces) used by application
  - `<context>/dto`: application-level DTOs (when needed)
- `domain/` – pure model and business rules
  - `<context>/model`: entities, value objects, aggregates
  - `<context>/service`: domain services (stateless)
  - `<context>/event`: domain events
  - `<context>/repository`: domain repository abstractions (if you prefer keeping ports here)
- `infrastructure/` – concrete adapters
  - `persistence/jpa/<context>`: Spring Data repositories, entities mapping, converters
  - `messaging/<context>`: Kafka/AMQP producers/consumers
  - `client/<context>`: HTTP clients (WebClient/RestClient), DTOs, mappers
  - `config`: infrastructure config, database, migrations (Flyway)
- `common/` – shared utilities, error types, annotations, pagination, clock abstraction

> Bound contexts example: `user`, `group`, `chat`, `plan`, `nutrition`. Prefer multiple small modules over one mega-module when the domain grows.

## DDD building blocks

- Entities: represent identity and lifecycle. Keep behavior with the data.
- Value Objects: immutable, validated at construction; equality by value.
- Aggregates: transactional boundaries; expose invariant-preserving methods.
- Domain Services: stateless operations that don’t fit a single entity.
- Domain Events: capture important state changes; publish from aggregates/use cases.
- Repositories: abstractions to load and persist aggregates (as ports).

### Invariants and validation

- Validate at boundaries (API) and enforce invariants in the domain.
- Fail fast with meaningful, non-leaky errors; map to proper HTTP statuses in API.

## Ports & Adapters (Hexagonal)

- Outbound ports are interfaces in `application/.../port/out` (or `domain/.../repository`).
- Adapters implement these ports in `infrastructure/...` and are wired by Spring.
- This keeps the core independent of JPA, HTTP clients, etc.

## CQRS (lightweight)

- Separate write (commands) and read (queries) use cases.
- Command handlers change state; query handlers retrieve data.
- Read models can be denormalized DTOs; use projections for performance.
- Use transactions at handler level (`@Transactional` on application layer), not controllers.

> Only introduce event sourcing or separate read DBs when necessary.

## Contracts and DTOs

- API DTOs belong to `api/.../rest` and are not reused in domain or persistence.
- Map between layers explicitly (manual or MapStruct). Avoid leaking JPA entities to API.
- Prefer immutable DTOs (Java records) when using Java 17+.

### API versioning and validation

- Version public APIs (e.g., `/api/v1/...`); avoid breaking changes—introduce new versions when needed.
- Use Bean Validation on request DTOs (`jakarta.validation.*`), mirror core rules; validate at controller boundaries.
- Centralize exception-to-response mapping and validation error shaping (consistent format).

## Error handling and logging

- Centralize API exception mapping with `@ControllerAdvice`.
- Use structured logging (JSON fields, correlation/request IDs). Do not log secrets/PII.
- Map known exceptions to 4xx; unexpected to 5xx without stack traces in responses.

## Observability

- Propagate correlation IDs across services; prefer W3C Trace Context (`traceparent`, `tracestate`).
- Metrics and tracing via Micrometer + OpenTelemetry; expose health/readiness/liveness endpoints.
- Log important domain events and command/query lifecycle at INFO; keep payloads safe (mask PII).

## Security

- Deny by default; explicit authorization checks per use case or resource.
- Validate inputs; sanitize outputs for any templated rendering.
- Never hardcode secrets; use environment/secret store. Always HTTPS for outbound calls.
- See `.github/instructions/security-and-owasp.instructions.md` for details.
- SSRF: allow-list outbound hosts/ports/paths when URLs come from users; validate and block private address ranges.

## Persistence (JPA) guidance

- Keep JPA annotations in infrastructure entities; map to domain models.
- Repositories in infrastructure implement outbound ports or domain repository interfaces.
- Favor optimistic locking (`@Version`).
- Use parameterized queries; avoid dynamic string concatenation.
- Migrations with Flyway/Liquibase; no schema drift.

## Performance & reliability

- Paginate list endpoints by default; provide sorting/filtering with safe allow-lists.
- Avoid N+1 queries: use fetch joins, projections, or explicit load strategies.
- Use caching where it clearly helps; define invalidation rules.
- Apply timeouts, retries with jitter, and circuit breakers to outbound calls (HTTP, messaging, DB where applicable).
- Prefer batch operations where supported; avoid chatty networks.

## Messaging and integrations

- Define outbound ports for external systems; implement clients in infrastructure.
- Apply timeouts, retries with jitter, and circuit breakers for network calls.
- Consider idempotency keys for externally-visible commands.

## Testing strategy

- Unit tests (pure): domain model and domain services.
- Application tests: command/query handlers with fake ports (in-memory test doubles).
- Spring slice tests:
  - `@WebMvcTest` for controllers (mock handlers)
  - `@DataJpaTest` for repositories/adapters
- Integration tests: thin happy-paths wiring real adapters (testcontainers recommended).
- Contract tests (where appropriate) between API and consumers or between adapters and external services, to detect breaking changes early.

Keep tests fast and deterministic; one or two critical E2E per bounded context.

## Example flow (Create Group)

1. API receives `POST /groups` with `CreateGroupRequest` (validated)
2. Controller maps to `CreateGroupCommand`
3. `CreateGroupHandler` (application) validates business preconditions, creates aggregate, calls `GroupRepository.save` (outbound port)
4. Infrastructure JPA adapter implements `GroupRepository` and persists entity
5. Handler returns `GroupId`, controller maps to `201 Created` response

## Conventions checklist

- Controllers are thin; no transactions, no business logic
- Application layer holds transactions and use case orchestration
- Domain is framework-agnostic, immutable by default, invariants enforced
- Outbound dependencies go through ports; adapters in infrastructure
- Separate commands/queries; avoid leaking JPA entities to API
- Centralized error handling, structured logging, no PII secrets in logs
- Security-by-default; environment-driven configuration

## When to scale the architecture

- Start simple (single module + packages per context)
- Extract submodules when: build/test time slows, teams split, or coupling grows
- Introduce CQRS read models or separate stores only for real performance needs

## References

- Clean Architecture – R. C. Martin
- Implementing Domain-Driven Design – V. Vernon
- Patterns, Principles, and Practices of DDD – S. Millett, N. Tune
- Hexagonal Architecture – A. Cockburn
