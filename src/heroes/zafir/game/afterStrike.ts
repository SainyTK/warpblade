import { hero } from "../../../game/state";
import { ZAFIR_MOVES } from "./moves";
import { afterBlow } from "./stringSkills";

/** a blow of one of his moves is out, with how many foes it hit */
export function afterStrike(id: string, hits: number): void {
  const m = ZAFIR_MOVES[id as keyof typeof ZAFIR_MOVES];
  if (!m) return;
  afterBlow(id, hero.hitIndex >= m.hits.length, hits);
}
