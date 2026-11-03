import type { ModelInfo } from '../../shared/api';
import { NON_CHAT_MODEL } from '../constants';

/** Picker order (owner decision, 3 November 2026): Claude families, then GPT variants. Unknown families follow. */
const FAMILY_ORDER = [
  'opus',
  'sonnet',
  'haiku',
  'fable',
  'gpt-sol',
  'gpt-terra',
  'gpt-luna',
  'gpt-astra',
];

interface ParsedModel {
  family: string;
  version: number[];
  /** A dated snapshot such as -20250929. The undated alias of the same version wins. */
  dated: boolean;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** The family and version of a proxy model ID, or null for anything that is not a chat model. */
export function parseModel(id: string): ParsedModel | null {
  if (NON_CHAT_MODEL.test(id)) {
    return null;
  }
  const claude = /^claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-(\d{8}))?$/.exec(id);
  if (claude) {
    const [, family = '', major = '0', minor, date] = claude;
    return { family, version: [Number(major), Number(minor ?? 0)], dated: Boolean(date) };
  }
  const legacy = /^claude-(\d+)-(\d+)-([a-z]+)(?:-(\d{8}))?$/.exec(id);
  if (legacy) {
    const [, major = '0', minor = '0', family = '', date] = legacy;
    return { family, version: [Number(major), Number(minor)], dated: Boolean(date) };
  }
  const gpt = /^gpt-(\d+(?:\.\d+)*)(?:-([a-z]+))?$/.exec(id);
  if (gpt) {
    const [, version = '0', variant] = gpt;
    return {
      family: variant ? `gpt-${variant}` : 'gpt',
      version: version.split('.').map(Number),
      dated: false,
    };
  }
  return null;
}

/** "claude-opus-5-5" -> "Opus 5.5", "claude-sonnet-4-5-20250929" -> "Sonnet 4.5", "gpt-6.1-sol" -> "GPT-6.1 Sol". */
export function modelLabel(id: string): string {
  const parsed = parseModel(id);
  if (!parsed) {
    return id;
  }
  if (parsed.family.startsWith('gpt')) {
    const variant = parsed.family.slice('gpt-'.length);
    return `GPT-${parsed.version.join('.')}${variant ? ` ${capitalize(variant)}` : ''}`;
  }
  const [major, minor] = parsed.version;
  return `${capitalize(parsed.family)} ${major}${minor ? `.${minor}` : ''}`;
}

/** Positive when `a` is newer than `b`. */
function compareVersions(a: ParsedModel, b: ParsedModel): number {
  for (let i = 0; i < Math.max(a.version.length, b.version.length); i++) {
    const difference = (a.version[i] ?? 0) - (b.version[i] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return Number(b.dated) - Number(a.dated);
}

function familyRank(family: string): number {
  const index = FAMILY_ORDER.indexOf(family);
  return index === -1 ? FAMILY_ORDER.length : index;
}

/**
 * The picker's models: only the newest model of each family in the proxy's list, Claude families first.
 * Older versions stay usable by sessions that already ran on them.
 */
export function chatModels(ids: string[]): ModelInfo[] {
  const newest = new Map<string, { id: string; parsed: ParsedModel }>();
  for (const id of ids) {
    const parsed = parseModel(id);
    if (!parsed) {
      continue;
    }
    const current = newest.get(parsed.family);
    if (!current || compareVersions(parsed, current.parsed) > 0) {
      newest.set(parsed.family, { id, parsed });
    }
  }
  return [...newest.values()]
    .sort(
      (a, b) =>
        familyRank(a.parsed.family) - familyRank(b.parsed.family) ||
        a.parsed.family.localeCompare(b.parsed.family),
    )
    .map(({ id }) => ({ id, label: modelLabel(id) }));
}
