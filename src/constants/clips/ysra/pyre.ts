import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import { HELD_CLIPS } from "../held";

/** Ysra calling a rite. Placeholder: borrows Kael's ultimate pose until her own lands. */
export const PYRE_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  rite: HELD_CLIPS.ultimate,
};
