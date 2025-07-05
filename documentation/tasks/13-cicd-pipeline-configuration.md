### User Story

As a developer, I want to have CI/CD pipelines configured so that tests, linting, and builds run automatically on every pull request and deployment is streamlined.

### Details

- Configure GitHub Actions (or other CI/CD tool) for the repository.
- Run lint, tests, and builds for frontend and backend on every PR.
- Ensure code quality checks (lint, test) are required for merging.
- Automate deployment steps (optional, e.g., to staging/production).
- Use caching to speed up builds.
- Notify on build/test failures.
- Document the pipeline setup and usage.

### Acceptance Criteria

- [ ] CI runs on every PR and push to main branches
- [ ] Lint, test, and build jobs are included for all apps
- [ ] PRs cannot be merged if checks fail
- [ ] (Optional) Deployment steps are automated
- [ ] Pipeline configuration is documented in `README.md` or a dedicated file

### Related technical tasks

- [ ] Set up GitHub Actions workflows for lint, test, build
- [ ] Add status checks for PRs
- [ ] (Optional) Add deployment steps
- [ ] Document CI/CD setup and usage
