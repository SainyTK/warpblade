import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import type { StanceClipName } from "../../../types/ysra/stance";
import { FINISHER_CLIPS } from "../finishers";
import { HELD_CLIPS } from "../held";
import { LOCOMOTION_CLIPS } from "../locomotion";

/** blows out of Ysra's vault, dive, guard and charge. Placeholder: borrows Kael's clips until her own land. */
export const STANCE_CLIPS = {
  yVaultCrash: FINISHER_CLIPS.skyRend,
} satisfies Record<StanceClipName, ActionClip>;

/** Ysra's own look on her feet and in the air, and her vault, dive, guard and backstep. Placeholders for now. */
export const STANCE_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  vault: LOCOMOTION_CLIPS.jump,
  dive: LOCOMOTION_CLIPS.fall,
  brace: HELD_CLIPS.charge,
  backstep: LOCOMOTION_CLIPS.dash,
};
