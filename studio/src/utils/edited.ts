import { formatClip } from '@game/motionClips';
import type { PoseClip } from '@game/types/drill';
import type { ClipFrames } from '@/types/studio';

const written = new WeakMap<ClipFrames, string>();

/** The clip as the game's JSON file would hold it, so a draft compares with the game at the precision it is saved. */
function asFile(clip: ClipFrames): string {
  const known = written.get(clip);
  if (known !== undefined) {
    return known;
  }
  const text = formatClip(clip);
  written.set(clip, text);
  return text;
}

/** True when both clips would write the same file. */
export const sameClip = (a: ClipFrames, b: ClipFrames): boolean => asFile(a) === asFile(b);

/** The clip as its file holds it, to tell a saved clip apart from others. */
export const clipText = asFile;

/** True when the draft would change the game's clip. */
export const differsFromGame = (draft: ClipFrames | undefined, game: PoseClip): boolean =>
  draft !== undefined && asFile(draft) !== asFile(game);
