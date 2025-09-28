### User Story

As a developer, I want the project to be properly configured with essential tools, linters, formatters, testing frameworks, and Copilot instructions so that development is consistent, maintainable, and efficient.

### Details

- Configure TypeScript for both frontend and backend.
- Set up Nx workspace for monorepo management.
- Configure ESLint and Prettier for code linting and formatting.
- Set up Jest for unit and integration testing (frontend and backend).
- Configure Husky for pre-commit hooks (lint, tests).
- Add recommended VSCode settings and extensions.
- Ensure all scripts are available in `package.json`.
- Document setup in `README.md`.
- **Add Copilot instructions:**
  - Global best practices for code quality, modularity, and documentation.
  - Frontend-specific guidelines (Angular, TypeScript, UI/UX, accessibility).
  - Backend-specific guidelines (Java, Spring Boot, REST API, security).
  - Prompts for writing clear commit messages.
  - Prompts for writing and maintaining tests.
  - Prompts for refactoring and code reviews.
  - Example prompts for Copilot usage in this project.

### Acceptance Criteria

- [ ] TypeScript is configured and working for all apps/packages
- [ ] Nx workspace is set up and usable
- [ ] ESLint and Prettier are configured and run on all code
- [ ] Jest is set up for both frontend and backend
- [ ] Husky pre-commit hooks run lint and tests
- [ ] VSCode settings/extensions are recommended in documentation
- [ ] All setup steps are documented in `README.md`
- [ ] Copilot instructions are available in the repository

### Related technical tasks

- [ ] Configure TypeScript for all projects
- [ ] Set up Nx workspace and project structure
- [ ] Configure ESLint and Prettier
- [ ] Set up Jest for testing
- [ ] Add Husky and configure pre-commit hooks
- [ ] Update `README.md` with setup instructions
- [ ] Add `.vscode` recommendations
- [ ] Create and maintain `copilot-instructions.md` with:
  - Global best practices
  - Frontend and backend guidelines
  - Prompts for commits, tests, refactoring, and code reviews
  - Example Copilot prompts for this project
