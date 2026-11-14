import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import { STANCE_FEET_CLIPS } from "./stanceFeet";
import { STANCE_GUARD_CLIPS } from "./stanceGuard";
import { STANCE_HELD_CLIPS } from "./stanceHeld";
import { STANCE_WARP_CLIPS } from "./stanceWarp";

/** Ysra's own look on her feet and in the air, her guard and backstep, her warp and dodge, and her ultimate's wind-up
 *  and release */
export const STANCE_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  ...STANCE_FEET_CLIPS,
  ...STANCE_GUARD_CLIPS,
  ...STANCE_HELD_CLIPS,
  ...STANCE_WARP_CLIPS,
};
