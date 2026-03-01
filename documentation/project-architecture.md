# Project Architecture

## Overview

The Gymates application is designed as a modern, modular, and scalable web platform. It follows a monorepo structure, separating the backend and frontend into distinct applications, while sharing configuration and documentation at the root level. The architecture supports rapid development, maintainability, and future extensibility.

## High-Level Architecture

- **Frontend**: Single Page Application (SPA) built with Angular (TypeScript), located in `apps/frontend`. It communicates with the backend via RESTful APIs and WebSockets for real-time features (e.g., chat, notifications).
- **Backend**: Java Spring Boot application, located in `apps/backend`. It exposes REST APIs, handles business logic, authentication, notifications, and integrates with a database.
- **Monorepo Management**: Uses Nx for workspace management, code sharing, and consistent tooling across frontend and backend.
- **Database**: Relational database (e.g., PostgreSQL or MySQL) for persistent storage of users, groups, trainings, diets, etc.
- **Documentation**: Centralized in the `documentation/` folder for business requirements and technical docs.

## Frontend Architecture

- **Framework**: Angular (TypeScript)
- **Structure**: Feature-based modules (e.g., Auth, Groups, Trainings, Diet, Admin)
- **State Management**: Angular services or NgRx (if needed for complex state)
- **Routing**: Angular Router for navigation
- **UI**: Responsive design for mobile/desktop, using Angular Material or similar
- **Testing**: Jest for unit/integration tests, Playwright for end-to-end tests

## Backend Architecture

- **Framework**: Spring Boot (Java)
- **Structure**: Clean Architecture with Ports & Adapters (Hexagonal/Onion) and DDD
  - `infrastructure/inbound`: web/mobile controllers, API DTOs, exception mapping
  - `infrastructure/outbound`: persistence (JPA), external clients (HTTP, messaging)
  - `application`: command/query handlers (CQRS), ports (interfaces), orchestration, transactions
  - `domain`: entities, value objects, domain services, domain events
- **API**: RESTful endpoints (versioned), JWT-based authentication
- **Real-Time**: WebSocket endpoints for chat and notifications
- **Persistence**: JPA/Hibernate; adapters implement application ports; migrations via Flyway/Liquibase
- **Testing**: Unit tests for domain, application handler tests with fakes, Spring slice tests for adapters, integration tests for happy-path wiring

## Key Architectural Features

- **Authentication & Authorization**: JWT tokens for secure API access, role-based permissions (admin, moderator, member)
- **Notifications**: Push/email notifications via backend services
- **Extensibility**: Modular codebase allows easy addition of new features (e.g., analytics, feedback system)
- **Admin Panel**: Separate frontend routes and backend endpoints for admin features
- **API Documentation**: OpenAPI/Swagger for backend API docs

## Communication Flow

1. **User interacts with frontend** (Angular SPA)
2. **Frontend sends API requests** to backend (Spring Boot)
3. **Backend processes requests**, interacts with the database, and returns responses
4. **Real-time features** (chat, notifications) use WebSockets for instant updates

## Deployment

- **Containerization**: Docker support for backend and frontend (recommended for production)
- **CI/CD**: Nx and standard tools for automated testing and deployment
- **Hosting**: Cloud or on-premise, with separate services for frontend (static hosting) and backend (API server)

## Future Considerations

- **Microservices**: The backend can be split into microservices if scaling is needed
- **Mobile App**: The API-centric design allows for future mobile app development
- **Analytics**: Extendable for advanced analytics and reporting

---

This architecture ensures a robust foundation for the Gymates app, supporting all MVP requirements and future growth.
