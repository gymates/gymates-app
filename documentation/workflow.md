# Gymates Project Workflow

## 1. Moving user stories to GitHub Issues

- Each user story from the `user-stories.md` file should be transferred to GitHub Issues as a separate issue.
- Issue title: consistent with the user story content.
- Issue description: details, acceptance criteria, related technical tasks.
- Any change in a user story (e.g., clarification, splitting into smaller tasks) should be reflected both in the `user-stories.md` file and in the corresponding GitHub issue.
- **Example issue template:**

  ```markdown
  ### User Story

  As a ... I want ... so that ...

  ### Details

  - ...

  ### Acceptance Criteria

  - [ ] ...
  - [ ] ...

  ### Related technical tasks

  - [ ] Backend: ...
  - [ ] Frontend: ...
  ```

## 2. Creating tasks (sub-tasks)

- Each user story is divided into smaller technical tasks (sub-tasks), which are also added to GitHub Issues (as checklists or separate issues linked to the main user story).
- Each task should have a clear description, acceptance criteria, and be linked to a user story.
- **Best practices:**
  - Tasks should be as small and independent as possible.
  - Each task should have a label (e.g., `frontend`, `backend`, `test`, `bug`).

## 3. Branching

- Each user story or larger task is implemented on a separate branch.
- Branch naming: `feature/<user-story-number>-short-description` or `fix/<user-story-number>-short-description`.
  - Example: `feature/1-registration-form`, `fix/2-login-error-handling`
- Commits should include the user story/task number and a short description of the changes.
  - Example: `[#1] Add registration form validation`
- **Best practices:**
  - Commits should be small, logical, and descriptive.
  - Avoid commits like "fix typo" – fix typos before committing.
  - Before starting work on a branch, update it from the main branch (`main`/`develop`).

## 4. Implementation and testing

- Every change should be covered by unit and/or integration tests.
- Before merging to the main branch (e.g., `main` or `develop`), code review and passing all tests are required.
- The PR description should include the user story/task number and a short description of the changes.
- **Example PR template:**

  ```markdown
  ### Related issue

  Closes #1

  ### Description of changes

  - Added registration form
  - Data validation

  ### Tests

  - [x] Unit tests
  - [x] Integration tests
  ```

- **Best practices:**
  - Cover new features and critical paths with tests.
  - Tests should be repeatable and independent.
  - Run all tests and lint locally before creating a PR.

## 5. Documentation update

- Any change in a user story or task should be reflected in the `user-stories.md` file and on GitHub Issues.
- Technical and business documentation should be kept up to date.
- **Best practices:**
  - Update diagrams if the architecture changes.
  - Document architectural decisions (e.g., in an `ADR` file).

## 6. Best practices

- Follow clean code principles: readability, naming, avoiding duplication, modularity.
- Each task should be testable and have clear acceptance criteria.
- Regularly sync with the main branch to avoid conflicts.
- Every commit and PR should be linked to a specific user story or task.
- **Code review:**
  - Check readability, requirements compliance, test coverage.
  - Provide constructive feedback and suggest solutions.
  - Approve PRs only after acceptance criteria are met and tests pass.

## 7. Automation

- It is recommended to configure CI/CD to automatically run tests and lint on every PR.
- You can use issue/PR templates on GitHub to standardize task and change descriptions.
- **Example tools:**
  - GitHub Actions for testing, linting, building the application.
  - Husky for pre-commit hooks (lint, local tests).
  - Dependabot for automatic dependency updates.

---

This workflow ensures transparency, high code quality, and easy tracking of progress on business requirements.
