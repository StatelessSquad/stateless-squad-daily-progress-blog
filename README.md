# {{APP_NAME}}

{{ONE_LINE_DESCRIPTION}}

> Created from `StatelessSquad/app-template` by DevEx. Replace the `{{...}}` placeholders in your bootstrap PR.

## Stack
- {{STACK}}

## Getting started
```bash
make setup   # install toolchain + pre-commit hooks
make dev     # run locally
make test    # run tests
```

## Project layout
```
src/            application code
tests/          tests
.github/        CI, Dependabot, templates
.devcontainer/  reproducible dev environment
```

## Conventions
- Trunk-based: short-lived branches `feat/...`, `fix/...`, `chore/...`; every change lands via PR into `main`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...). Semantic versioning via tags.
- CI must pass (lint, tests, secret scan) before merge. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
