import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import { PYRE_STATE_CLIPS } from "./pyre";
import { STANCE_STATE_CLIPS } from "./stance";

export { GLAIVE_CLIPS } from "./glaive";
export { STANCE_CLIPS } from "./stance";

/** every state Ysra poses herself; states missing here fall back to Kael's shared clips */
export const YSRA_STATE_CLIPS: Partial<Record<HeroState, ActionClip>> = {
  ...STANCE_STATE_CLIPS,
  ...PYRE_STATE_CLIPS,
};
/** Ysra's states whose clip repeats while she stays in them */
export const YSRA_LOOPING: ReadonlySet<HeroState> = new Set(["idle", "throwWait", "charge"]);
