import type { ClipName } from "../../types/hero";
import type { ActionClip } from "../../types/pose";
import { ACTION_CLIPS } from "./actions";
import { AIR_CLIPS } from "./air";
import { FINISHER_CLIPS } from "./finishers";
import { GROUND_CLIPS } from "./ground";
import { SITUATIONAL_CLIPS } from "./situational";
import { SKILL_CLIPS } from "./skills";
import { GLAIVE_CLIPS, STANCE_CLIPS } from "./ysra";

/**
 * Every keyed action: Kael's, then Ysra's. Every blow winds up the opposite way, snaps to a new silhouette on the hit frame,
 * holds it a beat and follows through.
 */
export const CLIPS = {
  ...GROUND_CLIPS,
  ...SITUATIONAL_CLIPS,
  ...SKILL_CLIPS,
  ...AIR_CLIPS,
  ...FINISHER_CLIPS,
  ...ACTION_CLIPS,
  ...GLAIVE_CLIPS,
  ...STANCE_CLIPS,
} satisfies Record<ClipName, ActionClip>;

export { LOOPING_STATES, STATE_CLIPS } from "./states";
