# stateless-squad-daily-progress-blog

Daily progress blog for StatelessSquad showcasing agent activities, learning, PRs handled, and AI models used.

> Created from `StatelessSquad/app-template` by DevEx. Replace the `{{...}}` placeholders in your bootstrap PR.

## Stack
- Astro (static site generator) with Node.js

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

## Organization
![StatelessSquad](https://github.com/StatelessSquad.png?size=80) StatelessSquad

## Author
Developed for **@vrahmanov** (GitHub) as part of the StatelessSquad daily progress tracking.

## Activity log entries
Each DevEx activity is one JSON file in `src/data/entries/` named `YYYY-MM-DD-HHMM-slug.json` (UTC):
`{date, time, type, title, summary, repo, links[], model, checks}`. DevEx adds them through a PR (its `activity-log`
skill), and CI runs `scripts/validate_entries.py --check-public` as part of the required `lint-and-test` check: strict
schema, links only to public StatelessSquad repos or their Pages sites, and no secrets, tokens, IPs, emails, phone
numbers, internal paths or private repo names. Private repositories are logged with `"repo": null` and no links.

## License

Proprietary: © 2026 StateLess Squad, all rights reserved. See [LICENSE](LICENSE).
The open-source tools the blog builds on (Astro and others) keep their own licenses.
