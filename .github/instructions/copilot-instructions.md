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

- Cross-cutting concerns
  - Validation at boundaries, idempotency for commands, retries with backoff for transient errors, circuit breakers for remote calls.
  - Configuration via environment/secret store; no hardcoded credentials (see OWASP file).

##

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

## How Copilot should proceed on new tasks

1. Clarify acceptance criteria and constraints. 2) Sketch minimal contracts (inputs/outputs, errors). 3) Add or update tests. 4) Implement in the appropriate layer, respecting dependencies. 5) Add observability, validate security concerns. 6) Run lint/tests. 7) Update docs and scaffolding if needed.

> Always cross-check with `security-and-owasp.instructions.md` and technology-specific instructions before finalizing code.
