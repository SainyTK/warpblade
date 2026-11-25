// A draft of one hero's motion clip: the frames as the owner posed them in the studio, saved by the server.
import type { DrillClipId } from '../../src/motionClips';
import type { Pose } from '../../src/types/pose';

export interface Draft {
  /** The hero, as named under src/heroes, such as `saya`. */
  hero: string;
  /** The clip it edits, as named under src/heroes/<hero>/motion, such as `strikes/first`. */
  clip: DrillClipId;
  updatedAt: string;
  frames: Pose[];
  snaps: number[];
}

/** Where drafts are kept, from the studio folder: one JSON file per clip under a folder per hero, such as `saya/strikes/first.json`. */
export const DRAFT_FOLDER = '.data/drafts';
