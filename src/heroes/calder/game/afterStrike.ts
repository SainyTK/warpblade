import { hero } from "../../../game/state";
import type { CalderMoveId } from "../types/moves";
import { CALDER_MOVES } from "./moves";
import { calder } from "./state";
import { fireTrigger } from "./trigger";

/** a move's blow is out: a Trigger move that landed fires its round into the wound and grows the streak; any other move
 *  breaks the streak */
export function afterStrike(id: CalderMoveId, hits: number): void {
  if (hero.hitIndex < CALDER_MOVES[id].hits.length) return;
  if (!hero.keen || hits === 0) {
    calder.triggerStreak = 0;
    return;
  }
  calder.triggerStreak++;
  fireTrigger();
}
