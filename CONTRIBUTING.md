# Contributing

1. Branch from `main`: `git switch -c feat/<short-topic>`.
2. Keep PRs small and focused; fill in the PR template.
3. Run `make test` and `pre-commit run -a` before pushing.
4. Direct pushes to `main` are not allowed; `main` only moves through reviewed PRs.
5. Never commit secrets. Use environment variables / the platform's secret store; `.env*` files are git-ignored.
