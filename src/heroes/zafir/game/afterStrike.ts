import { hero } from "../../../game/state";
import { ZAFIR_MOVES } from "./moves";
import { zafir } from "./state";

/** a move's last blow is out: a Keen spin that landed grows the Keen streak, any other move breaks it */
export function afterStrike(id: string, hits: number): void {
  const m = ZAFIR_MOVES[id as keyof typeof ZAFIR_MOVES];
  if (!m || hero.hitIndex < m.hits.length) return;
  zafir.keenStreak = hero.keen && hits > 0 ? zafir.keenStreak + 1 : 0;
}
