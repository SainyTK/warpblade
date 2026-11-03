import { CLIPS, STATE_CLIPS } from '@game/constants/clips';
import { POSES, READY, STAND } from '@game/constants/hero';
import type { ActionClip, Pose } from '@game/types/pose';

/** The game's named poses, to start a snapshot from. */
export const POSE_PRESETS: readonly { id: string; label: string; pose: Pose }[] = [
  { id: 'stand', label: 'Stand', pose: STAND },
  { id: 'ready', label: 'Ready', pose: READY },
  ...Object.entries(POSES).map(([id, pose]) => ({ id, label: id, pose })),
];

/** Every keyed clip in the game, moves and actions alongside the free and held states (idle, walk, jump...). */
export const GAME_CLIPS: Readonly<Record<string, ActionClip>> = { ...CLIPS, ...STATE_CLIPS };

/** Clips that strike or release at their hit time: the moves and actions, not the states. */
export const STRIKING_CLIPS: ReadonlySet<string> = new Set(Object.keys(CLIPS));

/** The game's keyed clips, to start a motion from. */
export const CLIP_NAMES = Object.keys(GAME_CLIPS).sort();
