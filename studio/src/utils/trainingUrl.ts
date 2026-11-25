import { EVERY_DRAFT } from '@game/motionClips';
import { TRAINING_PATH } from '@shared/ports';

export function trainingUrl(hero: string): string {
  const query = new URLSearchParams({ training: hero, drafts: EVERY_DRAFT });
  return `${TRAINING_PATH}?${query}`;
}
