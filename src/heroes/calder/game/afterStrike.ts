import { hero } from "../../../game/state";
import type { CalderMoveId } from "../types/moves";
import { CALDER_MOVES } from "./moves";
import { skyshot } from "./skills/blastJump";
import { twinRound } from "./skills/hairTriggerTwin";
import { vent } from "./skills/ventBlast";
import { calder } from "./state";
import { fireTrigger } from "./trigger";

/**
 * A move's blow is out: Vent Blast vents behind every blow; on the move's last blow a Trigger that landed fires its
 * round into the wound and grows the streak (two rounds on Breaker with Hair Trigger's sixth level), any other move breaks
 * the streak, and Skyshot fires down from an air blow.
 */
export function afterStrike(id: CalderMoveId, hits: number): void {
  vent();
  if (hero.hitIndex < CALDER_MOVES[id].hits.length) return;
  if (hits > 0) skyshot(hero.lastHit);
  if (!hero.keen || hits === 0) {
    calder.triggerStreak = 0;
    return;
  }
  calder.triggerStreak++;
  fireTrigger();
  if (id === "breaker") twinRound();
}
