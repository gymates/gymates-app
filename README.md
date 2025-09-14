# Gymates App

Gymates is a social and training app for gym-goers: friends and groups, chat, training and meal plans, progress tracking, and notifications. This repository is an Nx-managed monorepo that includes the frontend (Angular 19 + SSR), the backend (Spring Boot), and E2E tests (Playwright).

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
- [Nx Cloud](#nx-cloud)

---

## Project Structure

- `apps/frontend` – Frontend (Angular 19 + SSR)
- `apps/backend` – Backend (Java, Spring Boot)
- `apps/frontend-e2e` – E2E tests (Playwright)
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
- See `apps/backend/HELP.md`.

## Development

- **Frontend:**
  ```sh
  nx serve frontend
  ```
- **Backend:**
  ```sh
  nx run backend:serve
  # or
  nx run backend:run
  ```
- **Lint:**
  ```sh
  nx lint frontend
  # or for all
  nx run-many --target=lint --all
  ```
- **Format:**
  ```sh
  npm run format
  ```

## Testing

- **Frontend:**
  ```sh
  nx test frontend
  ```
- **Backend:**
  ```sh
  nx run backend:test
  ```

## Code Quality

- **ESLint** (flat config) and **Prettier** are configured for TypeScript.
  - Prettier v3 configured via `.prettierrc` (e.g., `singleQuote: true`).
  - `.prettierignore` excludes build outputs, including Maven `target/`.
  - ESLint integrates `eslint-config-prettier` to avoid style rule conflicts with Prettier.
- **Husky** runs lint and tests before commits.
- **Jest** is used for frontend tests; backend uses JUnit.
- We enforce module boundaries via `@nx/enforce-module-boundaries` using project tags:
  - `apps/frontend`: [type:app, scope:frontend]
  - `apps/backend`: [type:app, scope:backend]
  - `apps/frontend-e2e`: [type:e2e, scope:frontend]

## VSCode Recommendations

- Install recommended extensions from `.vscode/extensions.json`:
  - ESLint
  - Prettier
  - Java Extension Pack
  - Nx Console
- Workspace settings in `.vscode/settings.json`.

## Scripts

- Scripts from `package.json`:
  - `npm run start:fe` — starts the frontend (`nx serve frontend`)
  - `npm run build:fe` — builds the frontend (`nx build frontend`)
  - `npm run test:fe` — runs frontend tests (`nx test frontend`)
  - `npm run e2e` — runs e2e tests (`nx e2e frontend-e2e`)
  - `npm run serve:be` — serves the backend (`nx run backend:serve`)
  - `npm run run:be` — runs the backend (`nx run backend:run`)
  - `npm run build:be` — builds the backend (`nx run backend:build`)
  - `npm run test:be` — runs backend tests (`nx run backend:test`)
  - `npm run clean:be` — cleans the backend (`nx run backend:clean`)
  - `npm run format` — formats the repo with Prettier

## Nx Cloud

- CI uses Nx Cloud (runner `nx-cloud`). To enable remote cache, logs, and distributed execution, add a GitHub secret `NX_CLOUD_ACCESS_TOKEN` with a CI token generated in Nx Cloud (Project Settings → Access Tokens).
- The workflow `.github/workflows/ci.yml` includes a Node/Java matrix and an optional distribution step (`npx nx-cloud start-ci-run`) that runs when the secret is present.
- You can see logs and statuses (cache/executed) in Nx Cloud → Runs.

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
