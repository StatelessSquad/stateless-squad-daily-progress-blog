// Activity log: one JSON file per entry in ./entries (YYYY-MM-DD-HHMM-slug.json), written by the DevEx agent
// through a PR and validated in CI by scripts/validate_entries.py (schema, public links only, no secrets).
export type UpdateType =
  | 'bootstrapped' | 'created' | 'opened' | 'fixed' | 'merged' | 'closed' | 'reviewed'
  | 'published' | 'enabled' | 'updated' | 'task' | 'blocked' | 'explored' | 'proposed' | 'launched' | 'qa';

export interface Link { label: string; href: string }
export interface Update {
  date: string;          // YYYY-MM-DD (UTC)
  time: string;          // HH:MM (UTC)
  type: UpdateType;
  title: string;
  summary: string;
  repo?: string | null;  // null for private repositories (logged anonymously)
  links?: Link[];
  model?: string;
  checks?: 'green' | 'red' | 'n/a';
  agent?: 'DevEx' | 'Expenio' | 'Owner' | 'FinAIrena';
  cloud?: 'oci' | 'aws' | 'multi'; // where the agent that did the work runs (missing = derived from the agent)   // which agent did it (missing = DevEx, the original author)
}

const files = import.meta.glob<Update>('./entries/*.json', { eager: true, import: 'default' });
export const updates: Update[] = Object.values(files).sort((a, b) =>
  `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

const m = (badge: string, accent: string, dot: string) => ({ badge, accent, dot });
export const typeMeta: Record<UpdateType, { label: string; badge: string; accent: string; dot: string }> = {
  bootstrapped: { label: 'Bootstrapped', ...m('bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300', 'border-l-orange-500', 'bg-orange-500') },
  created:      { label: 'Created',      ...m('bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300', 'border-l-indigo-500', 'bg-indigo-500') },
  opened:       { label: 'PR opened',    ...m('bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300', 'border-l-cyan-500', 'bg-cyan-500') },
  fixed:        { label: 'Fixed',        ...m('bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', 'border-l-emerald-500', 'bg-emerald-500') },
  merged:       { label: 'Merged',       ...m('bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300', 'border-l-blue-500', 'bg-blue-500') },
  closed:       { label: 'Closed',       ...m('bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', 'border-l-amber-500', 'bg-amber-500') },
  reviewed:     { label: 'Reviewed',     ...m('bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/15 dark:text-fuchsia-300', 'border-l-fuchsia-500', 'bg-fuchsia-500') },
  published:    { label: 'Published',    ...m('bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300', 'border-l-teal-500', 'bg-teal-500') },
  enabled:      { label: 'Enabled',      ...m('bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300', 'border-l-violet-500', 'bg-violet-500') },
  updated:      { label: 'Updated',      ...m('bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300', 'border-l-sky-500', 'bg-sky-500') },
  task:         { label: 'Task done',    ...m('bg-lime-100 text-lime-800 dark:bg-lime-500/15 dark:text-lime-300', 'border-l-lime-500', 'bg-lime-500') },
  explored:     { label: 'Explored',     ...m('bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300', 'border-l-yellow-500', 'bg-yellow-500') },
  proposed:     { label: 'Proposed',     ...m('bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-300', 'border-l-pink-500', 'bg-pink-500') },
  launched:     { label: 'Launched',     ...m('bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300', 'border-l-green-500', 'bg-green-500') },
  qa:           { label: 'Q&A',          ...m('bg-cyan-100 text-cyan-900 dark:bg-cyan-500/15 dark:text-cyan-300', 'border-l-cyan-600', 'bg-cyan-600') },
  blocked:      { label: 'Blocked',      ...m('bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300', 'border-l-rose-500', 'bg-rose-500') },
};

export type Agent = 'DevEx' | 'Expenio' | 'Owner' | 'FinAIrena';
export type Cloud = 'oci' | 'aws' | 'multi';
export const agentMeta: Record<Agent, { role: string; chip: string; home: Cloud }> = {
  DevEx:     { role: 'builds',            chip: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900', home: 'oci' },
  Expenio:   { role: 'strategy and GTM',  chip: 'bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-900', home: 'oci' },
  Owner:     { role: 'infrastructure',    chip: 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-900', home: 'multi' },
  FinAIrena: { role: 'finance Q&A',       chip: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-900', home: 'aws' },
};

export const cloudMeta: Record<Cloud, { label: string; chip: string }> = {
  oci:   { label: 'Oracle Cloud', chip: 'border border-red-300 text-red-700 dark:border-red-500/40 dark:text-red-300' },
  aws:   { label: 'AWS',          chip: 'border border-orange-300 text-orange-700 dark:border-orange-500/40 dark:text-orange-300' },
  multi: { label: 'Multi-cloud',  chip: 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300' },
};
export const cloudOf = (u: Update): Cloud => u.cloud ?? agentMeta[u.agent ?? 'DevEx'].home;
