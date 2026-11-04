import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import type { GlaiveClipName } from "../../../types/ysra/glaive";
import { SKILL_CLIPS } from "../skills";

/** Ysra's glaive string, held lunge and their variants. Placeholder: borrows Kael's thrust until her own clips land. */
export const GLAIVE_CLIPS = {
  yThrust: SKILL_CLIPS.thrust,
} satisfies Record<GlaiveClipName, ActionClip>;

/** Ysra's glaive states, posed by her kit */
export const GLAIVE_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  heft: SKILL_CLIPS.thrust,
};
