import { hero } from "../../../game/state";
import type { YunMoveId } from "../types/moves";
import { echoBlow } from "./echo";
import { YUN_MOVES } from "./moves";

/** a move's blow is out: every held spirit sword repeats it as a thrust ahead, Keen when the blow was */
export function afterStrike(id: YunMoveId, _hits: number): void {
  if (hero.hitIndex < YUN_MOVES[id].hits.length) return;
  echoBlow(hero.keen);
}
