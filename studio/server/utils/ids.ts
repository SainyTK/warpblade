import { randomUUID } from 'node:crypto';

/** Sketch and job IDs: lowercase letters, digits and hyphens, safe as folder names. */
export const ID_PATTERN = /^[a-z0-9-]{1,64}$/;

export const newId = (): string => randomUUID();

/** A short readable slug for branch and folder names, such as "rising-moon-cut-3f2a". */
export function slug(text: string, id: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .join('-');
  return `${words || 'sketch'}-${id.slice(0, 4)}`;
}
