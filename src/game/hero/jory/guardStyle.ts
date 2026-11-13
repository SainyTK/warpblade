import { DRUM_GUARD } from "../../../constants/jory/moves";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { emitSkillEvent } from "../../skills/events";
import { judgeShared, raiseTier, tier } from "./beat";
import { burstBoom } from "./boom";

/**
 * Counterbeat: the parried blow rings off the drum as a full Boom that pushes foes back and drowns their shots; with K
 * pressed on the beat it also lifts his Groove a whole tier.
 */
function parried(_fromX: number, _foe: Enemy | null): void {
  const before = tier();
  const judged = judgeShared("K");
  burstBoom(true, judged.onBeat);
  if (judged.onBeat) raiseTier(before);
}

/** a blow stopped on the drum: the skills hear which foe struck it */
function blocked(_fromX: number, foe: Enemy | null): void {
  if (foe) emitSkillEvent({ type: "drumBlock", foe });
}

/** Jory's guard: the war drum held up as a shield, a middling block, and Counterbeat on a parry */
export const JORY_GUARD: GuardStyle = {
  chip: DRUM_GUARD.chip,
  blockCost: DRUM_GUARD.blockCost,
  blocked,
  parried,
};
