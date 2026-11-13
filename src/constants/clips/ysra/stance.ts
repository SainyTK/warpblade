import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import type { StanceClipName } from "../../../types/ysra/stance";
import { STANCE_FEET_CLIPS } from "./stanceFeet";
import { STANCE_GUARD_CLIPS } from "./stanceGuard";
import { STANCE_HELD_CLIPS } from "./stanceHeld";
import { STANCE_TRAVEL_CLIPS } from "./stanceTravel";
import { STANCE_WARP_CLIPS } from "./stanceWarp";

/** blows out of Ysra's vault, dive, guard and charge */
export const STANCE_CLIPS = {
  yVaultCrash: STANCE_TRAVEL_CLIPS.yVaultCrash,
} satisfies Record<StanceClipName, ActionClip>;

/** Ysra's own look on her feet and in the air, her vault, dive, guard and backstep, her warp and dodge, and her
 *  ultimate's wind-up and release */
export const STANCE_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  ...STANCE_FEET_CLIPS,
  ...STANCE_GUARD_CLIPS,
  ...STANCE_HELD_CLIPS,
  ...STANCE_WARP_CLIPS,
  vault: STANCE_TRAVEL_CLIPS.vault,
  dive: STANCE_TRAVEL_CLIPS.dive,
};
