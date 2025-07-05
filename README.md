# Gymates App

A monorepo for the Gymates application, managed with Nx. Includes frontend (TypeScript), backend (Java/Spring), and documentation.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [VSCode Recommendations](#vscode-recommendations)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Documentation](#documentation)

---

## Project Structure

- `apps/frontend` – Frontend app (TypeScript, Nx)
- `apps/backend` – Backend app (Java, Spring Boot)
- `documentation/` – Business, technical docs, user stories, tasks

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd gymates-app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up backend:**
   - Requires Java 17+ and Maven.
   - See `apps/backend/HELP.md` for backend setup.

## Development

- **Frontend:**
  ```sh
  nx serve frontend
  ```
- **Backend:**
  ```sh
  cd apps/backend
  ./mvnw spring-boot:run
  ```
- **Lint:**
  ```sh
  nx lint frontend
  # or for all
  nx run-many --target=lint --all
  ```
- **Format:**
  ```sh
  npx prettier --write .
  ```

## Testing

- **Frontend:**
  ```sh
  nx test frontend
  ```
- **Backend:**
  ```sh
  cd apps/backend
  ./mvnw test
  ```

## Code Quality

- **ESLint** and **Prettier** are configured for TypeScript code.
- **Husky** runs lint and tests before commits.
- **Jest** is used for frontend tests; backend uses JUnit.

## VSCode Recommendations

- Install recommended extensions from `.vscode/extensions.json`:
  - ESLint
  - Prettier
  - Java Extension Pack
  - Nx Console
- Workspace settings in `.vscode/settings.json`.

## Scripts

- All scripts are available in `package.json` and Nx workspace.
- Common scripts:
  - `npm run lint`
  - `npm run format`
  - `npm test`
  - `nx <command>`

## Contributing

- Follow the [workflow](./documentation/workflow.md) and [user stories](./documentation/user-stories.md).
- Use feature branches: `feature/<number>-desc`.
- Write clear, small commits and PRs.
- Update documentation as needed.

## Documentation

- See `documentation/` for:
  - [Workflow](./documentation/workflow.md)
  - [User Stories & Tasks](./documentation/user-stories.md)
  - [Architecture](./documentation/project-architecture.md)
  - [Business Requirements](./documentation/business-requirements.md)
