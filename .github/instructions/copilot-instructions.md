---
applyTo: '*'
description: 'General engineering and architecture guidance for GitHub Copilot across the repository (SOLID/DRY/YAGNI/KISS, Clean Architecture, DDD, Hexagonal/Onion).'
---

# Copilot General Engineering & Architecture Instructions

These instructions guide how code should be designed and written across this repository. They complement security rules in `security-and-owasp.instructions.md` (always apply those first) and any technology-specific instructions.

## Scope and priorities

- Security-first: follow the Secure Coding & OWASP instructions in this repo for all code paths (no secrets in code, parameterized queries, safe output encoding, least privilege, HTTPS, etc.).
- Maintainability-first: code must be simple, readable, and testable.
- Explicit contracts: define inputs/outputs, invariants, and error modes before implementation.
- Small increments: deliver minimal vertical slices with tests; avoid over-engineering.

## Core engineering principles

- SOLID
  - Single Responsibility: each class/function has one reason to change.
  - Open/Closed: open for extension via composition/abstraction; closed for modification of stable contracts.
  - Liskov Substitution: derived implementations must preserve contracts and invariants.
  - Interface Segregation: prefer small, role-focused interfaces.
  - Dependency Inversion: depend on abstractions (ports), not concretions (adapters).
- DRY: avoid duplication of knowledge; prefer reuse and shared utilities, but do not over-abstract prematurely.
- YAGNI: implement only what's needed for current requirements; defer hypothetical features.
- KISS: keep code and APIs simple; prefer clarity over cleverness.
- Separation of Concerns: isolate domain logic from application orchestration and infrastructure.
- Immutability by default: favor immutable data structures and pure functions when practical.
- Fail fast: validate inputs early; surface actionable errors.
- Observability: instrument meaningful logs/metrics/traces without leaking secrets.

## Architecture guidance

- Clean Architecture layering
  - Domain (enterprise rules): entities, value objects, domain services; no framework dependencies.
  - Application (use cases): orchestrates domain; defines input/output ports and DTOs; no infrastructure details.
  - Interface/Adapters (inbound): controllers, CLI, schedulers mapping requests to use cases/DTOs.
  - Infrastructure (outbound): persistence, message brokers, email, third-party APIs implementing ports.
  - Rule: inner layers must not depend on outer layers; dependencies point inward.
- DDD essentials
  - Ubiquitous Language: use domain terms consistently in code and tests.
  - Bounded Contexts: split large domains; keep models context-specific.
  - Aggregates with invariants and transactional boundaries; modify via aggregate roots.
  - Domain Events for significant state changes; publish from domain and handle in application/integration layers.
  - Repositories abstract aggregate persistence; return domain objects, not ORM types.
- Hexagonal/Onion architecture
  - Ports (interfaces) define required and provided capabilities at the application boundary.
  - Adapters implement ports (e.g., database adapter, HTTP client adapter).
  - Replaceable edges: allow swapping infra (DB, queues, providers) with minimal changes.
- Cross-cutting concerns
  - Validation at boundaries, idempotency for commands, retries with backoff for transient errors, circuit breakers for remote calls.
  - Configuration via environment/secret store; no hardcoded credentials (see OWASP file).

## Practical structure (Java/Spring Boot)

- Suggested package layout by context (example):
  - `io.github.gymates.<bc>.domain` — aggregates, value objects, domain services, events
  - `io.github.gymates.<bc>.application` — use cases, commands/queries, ports (interfaces), DTOs
  - `io.github.gymates.<bc>.infrastructure` — repositories, external clients, config
  - `io.github.gymates.<bc>.interfaces` — REST controllers, mappers, request/response models
- Controllers
  - Map HTTP to use cases; keep thin; validate DTOs; never expose entities directly.
  - Use request/response DTOs and mappers; sanitize and encode outputs to avoid XSS.
- Persistence
  - Use repositories behind interfaces (ports). Implementations can use JPA/JDBC/etc.
  - No domain logic in JPA entities; enforce invariants in domain layer.
- Transactions
  - Demarcate at application service or use-case level (`@Transactional`), not in controllers.
- Testing
  - Unit-test domain and use cases without Spring context.
  - Slice tests for adapters (e.g., `@DataJpaTest`); integration tests for wiring.
- Configuration
  - Externalize via `application.properties` + env overrides; use profiles; avoid `@Value` proliferation—prefer typed config properties.

## Practical structure (Angular/Nx)

- Use standalone components (Angular 16+) and feature modules only when they add value.
- Organize libraries by domain and layer (e.g., `feature`, `ui`, `data-access`, `util`).
- Smart vs. dumb components: container components orchestrate; presentational components are pure and input-driven.
- State management: start simple with signals/inputs/outputs; introduce NgRx or alternatives when complexity requires.
- Avoid shared mutable state; use services as facades for data-access.
- HttpClient
  - Strongly type requests/responses; centralize interceptors (auth, error handling, caching).
  - Sanitize any HTML before binding if unavoidable; prefer property binding over `[innerHTML]`.

## API and contracts

- Define minimal, explicit contracts:
  - Input/Output schemas (DTOs), error types, idempotency rules, pagination and filtering conventions.
  - Version public APIs; avoid breaking changes.
- Validation
  - Backend: bean validation on DTOs; domain invariants in aggregates; centralized exception handling.
  - Frontend: form validators mirroring backend rules; display actionable messages.

## Error handling and logging

- Use structured logging (JSON fields for correlation IDs, user ID, request ID).
- Do not log secrets, tokens, or PII without masking/redaction.
- Map exceptions to appropriate HTTP status codes; avoid stack traces in production responses.
- Include correlation IDs across services; prefer W3C Trace Context if available.

## Performance and reliability

- Choose efficient data structures/algorithms; avoid premature optimization.
- Use caching where it clearly helps; invalidate consciously.
- Apply timeouts, retries with jitter, and circuit breakers for remote calls.
- Paginate/list endpoints; avoid N+1 queries; prefer batch operations.

## Testing strategy

- Unit tests: fast, isolated, deterministic; cover domain and critical utilities.
- Component tests: Angular component rendering and interactions.
- Integration tests: Spring slice tests; wire adapters and persistence.
- End-to-end tests: Playwright based happy-path and critical flows.
- Contract tests where appropriate between FE/BE.
- Coverage thresholds are a guide, not a goal; test behavior and invariants.

## Code style and reviews

- Follow Prettier and ESLint rules (FE) and language idioms (BE). Keep functions small.
- Favor pure functions and dependency injection for testability.
- Avoid long parameter lists; use value objects/builders when appropriate.
- PRs should be small, focused, and include tests and docs updates.

## Git and CI basics

- Conventional commits or clear messages describing behavior change.
- Feature branches per task; keep commits atomic and logically separated.
- Run lint/tests locally before PR; ensure CI passes; fix linters instead of disabling.

## Documentation and Definition of Done

- Update README/ADR/docs on user-visible changes, new endpoints, or decisions.
- Include a brief usage example for new public APIs.
- DoD: implemented requirements, no critical/high security issues, tests added and green, docs updated, performance acceptable, feature flagged if risky.

## When to choose which architecture

- Start with Clean layering; introduce DDD/Hexagonal when domain/integration complexity justifies it.
- Use Hexagonal/Ports & Adapters when you have multiple external systems or plan to swap infra.
- Apply DDD patterns (Aggregates, BCs) when domain rules are complex and evolving.

## How Copilot should proceed on new tasks

1. Clarify acceptance criteria and constraints. 2) Sketch minimal contracts (inputs/outputs, errors). 3) Add or update tests. 4) Implement in the appropriate layer, respecting dependencies. 5) Add observability, validate security concerns. 6) Run lint/tests. 7) Update docs and scaffolding if needed.

> Always cross-check with `security-and-owasp.instructions.md` and technology-specific instructions before finalizing code.
