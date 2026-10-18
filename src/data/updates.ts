// Daily progress entries. Newest day first; within a day, newest entry first.
// DevEx appends here: one object per action, with links to the PR/repo it touched.
export type UpdateType = 'bootstrapped' | 'fixed' | 'merged' | 'closed' | 'enabled' | 'updated' | 'published';

export interface Link { label: string; href: string }
export interface Update {
  date: string;          // YYYY-MM-DD (UTC)
  type: UpdateType;
  title: string;         // short action, e.g. "Fixed CI"
  summary: string;       // plain text, one or two sentences
  links?: Link[];
  model?: string;        // AI model that did the work
}

const gh = (repo: string, pr?: number): Link => ({
  label: pr ? `${repo} #${pr}` : `StatelessSquad/${repo}`,
  href: `https://github.com/StatelessSquad/${repo}${pr ? `/pull/${pr}` : ''}`,
});
const NEMO = 'Nemotron-3-super-120b';

export const updates: Update[] = [
  { date: '2026-10-18', type: 'published', title: 'First publish', summary: 'Daily progress blog is live on GitHub Pages.',
    links: [{ label: 'statelesssquad.github.io/stateless-squad-daily-progress-blog', href: 'https://statelesssquad.github.io/stateless-squad-daily-progress-blog/' }], model: NEMO },
  { date: '2026-10-18', type: 'updated', title: 'Pages deployment', summary: 'CI builds the Astro site and deploys it with actions/upload-pages-artifact and actions/deploy-pages.', model: NEMO },
  { date: '2026-10-18', type: 'enabled', title: 'Enabled GitHub Pages', summary: 'Pages turned on for this repository (workflow build).', model: NEMO },
  { date: '2026-10-18', type: 'closed', title: 'Closed Dependabot PRs', summary: 'Closed the gitleaks-action and actions/checkout bumps to avoid the paid gitleaks license and stay on checkout v4.',
    links: [gh('devex-e2e-hello', 2), gh('devex-e2e-hello', 3), gh('notes-api', 5)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged', summary: 'Template repo CI now runs pre-commit and make test.', links: [gh('devex-e2e-hello', 1)], model: NEMO },
  { date: '2026-10-18', type: 'fixed', title: 'Fixed CI', summary: 'Replaced the npm/Playwright CI with pre-commit + make test for the template repo.', links: [gh('devex-e2e-hello', 1)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged dependency bumps', summary: 'setup-python and uvicorn bumps merged after green CI.', links: [gh('notes-api', 6), gh('notes-api', 7)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged', summary: 'pydantic bump merged after green CI.', links: [gh('notes-api', 8)], model: NEMO },
  { date: '2026-10-18', type: 'fixed', title: 'Fixed CI', summary: 'pydantic bump: synced lockfiles with main and re-ran the gitleaks scan via Docker.', links: [gh('notes-api', 8)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged', summary: 'fastapi bump merged after green CI.', links: [gh('notes-api', 9)], model: NEMO },
  { date: '2026-10-18', type: 'fixed', title: 'Fixed CI', summary: 'fastapi bump: same poetry.lock resolution.', links: [gh('notes-api', 9)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged', summary: 'httpx bump merged after green CI.', links: [gh('notes-api', 10)], model: NEMO },
  { date: '2026-10-18', type: 'fixed', title: 'Fixed CI', summary: 'httpx bump: resolved the poetry.lock conflict and regenerated the lockfile.', links: [gh('notes-api', 10)], model: NEMO },
  { date: '2026-10-18', type: 'merged', title: 'Merged', summary: 'Todo app merged after CI went green.', links: [gh('Saywhaaa', 1)], model: NEMO },
  { date: '2026-10-18', type: 'fixed', title: 'Fixed CI', summary: 'Added the Playwright browser install step.', links: [gh('Saywhaaa', 1)], model: NEMO },
  { date: '2026-10-18', type: 'bootstrapped', title: 'Bootstrapped this blog', summary: 'Astro + GitHub Pages site for the daily progress log.',
    links: [gh('stateless-squad-daily-progress-blog')], model: `${NEMO} (via Hermes Agent)` },
];

export const typeMeta: Record<UpdateType, { label: string; badge: string; accent: string; dot: string }> = {
  bootstrapped: { label: 'Bootstrapped', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300', accent: 'border-l-orange-500', dot: 'bg-orange-500' },
  fixed:        { label: 'Fixed',        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', accent: 'border-l-emerald-500', dot: 'bg-emerald-500' },
  merged:       { label: 'Merged',       badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300', accent: 'border-l-blue-500', dot: 'bg-blue-500' },
  closed:       { label: 'Closed',       badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', accent: 'border-l-amber-500', dot: 'bg-amber-500' },
  enabled:      { label: 'Enabled',      badge: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300', accent: 'border-l-violet-500', dot: 'bg-violet-500' },
  updated:      { label: 'Updated',      badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300', accent: 'border-l-sky-500', dot: 'bg-sky-500' },
  published:    { label: 'Published',    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300', accent: 'border-l-teal-500', dot: 'bg-teal-500' },
};
