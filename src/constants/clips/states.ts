import type { StateClipName } from "../../types/hero";
import type { ActionClip } from "../../types/pose";
import { GUARD_CLIPS } from "./guard";
import { HELD_CLIPS } from "./held";
import { LOCOMOTION_CLIPS } from "./locomotion";

/**
 * Kael's free and held states as keyed clips. Loops repeat over their duration; walk and run are sampled by the stride;
 * the rest play once from entering the state and hold their last key.
 */
export const STATE_CLIPS = { ...LOCOMOTION_CLIPS, ...HELD_CLIPS, ...GUARD_CLIPS } satisfies Record<
  StateClipName,
  ActionClip
>;

/** states whose clip repeats while Kael stays in them */
export const LOOPING_STATES: ReadonlySet<StateClipName> = new Set(["idle", "hang", "charge", "throwWait"]);
