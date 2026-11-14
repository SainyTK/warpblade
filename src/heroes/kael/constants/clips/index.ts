import type { HeroClips } from "../../../../types/character";
import type { ActionClip } from "../../../../types/pose";
import type { KaelClipName } from "../../types/moves";
import { AIR_CLIPS } from "./air";
import { FINISHER_CLIPS } from "./finishers";
import { GROUND_CLIPS } from "./ground";
import { SKILL_CLIPS } from "./skills";
import { STRING_CLIPS } from "./string";

/**
 * Every clip Kael's moves play. Every blow winds up the opposite way, snaps to a new silhouette on the hit frame,
 * holds it a beat and follows through.
 */
export const KAEL_ACTION_CLIPS = {
  ...STRING_CLIPS,
  ...GROUND_CLIPS,
  ...SKILL_CLIPS,
  ...AIR_CLIPS,
  ...FINISHER_CLIPS,
} satisfies Record<KaelClipName, ActionClip>;

/** Kael's clips as the roster reads them: his moves' actions; he rests in the shared idle */
export const KAEL_CLIPS: HeroClips = { actions: KAEL_ACTION_CLIPS };
