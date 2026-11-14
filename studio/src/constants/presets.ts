import { ACTION_CLIPS, STATE_CLIPS } from '@game/constants/clips';
import { CHARACTERS } from '@game/heroes/roster';
import { POSES, READY, STAND } from '@game/constants/hero';
import type { ActionClip, Pose } from '@game/types/pose';

/** The game's named poses, to start a snapshot from. */
export const POSE_PRESETS: readonly { id: string; label: string; pose: Pose }[] = [
  { id: 'stand', label: 'Stand', pose: STAND },
  { id: 'ready', label: 'Ready', pose: READY },
  ...Object.entries(POSES).map(([id, pose]) => ({ id, label: id, pose })),
];

/** The clips that strike or release at their hit time: the shared actions, and each hero's own as `<hero id>/<clip>`. */
const STRIKES: Readonly<Record<string, ActionClip>> = {
  ...ACTION_CLIPS,
  ...Object.fromEntries(
    CHARACTERS.flatMap((c) => Object.entries(c.clips.actions).map(([name, clip]) => [`${c.id}/${name}`, clip])),
  ),
};

/** Every keyed clip in the game, moves and actions alongside the free and held states (idle, walk, jump...). */
export const GAME_CLIPS: Readonly<Record<string, ActionClip>> = { ...STRIKES, ...STATE_CLIPS };

/** Clips that strike or release at their hit time: the moves and actions, not the states. */
export const STRIKING_CLIPS: ReadonlySet<string> = new Set(Object.keys(STRIKES));

/** The game's keyed clips, to start a motion from. */
export const CLIP_NAMES = Object.keys(GAME_CLIPS).sort();
