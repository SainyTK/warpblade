import { DRAFT_FOLDER } from '@shared/draft';
import { type HeroMotion, studioHero } from '@/constants/heroMotion';

/** What to paste to Claude: the edited clips, where their drafts are, and the command that applies them. */
export function claudeNote(motions: readonly HeroMotion[]): string {
  const ids = motions.map((motion) => motion.id);
  const names = motions.map(
    (motion) => `${studioHero(motion.hero).name} ${motion.label} (${motion.id})`,
  );
  return [
    `Apply my Warpblade Studio motion edits: ${names.join(', ')}.`,
    `Drafts: ${ids.map((id) => `studio/${DRAFT_FOLDER}/${id}.json`).join(', ')}`,
    `Apply with: cd studio && npm run apply-motion -- ${ids.join(' ')}`,
  ].join('\n');
}
