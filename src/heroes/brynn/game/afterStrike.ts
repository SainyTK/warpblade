import { moveDef } from "../../../game/hero/kits";
import { hero } from "../../../game/state";
import { heavyLanded } from "./heavy";
import { heftForBlow } from "./heft";

/** a move's last blow is out: Heft for every foe it struck, and a heavy swing's crescent */
export function afterStrike(id: string, hits: number): void {
  if (hero.hitIndex < moveDef(id).hits.length) return;
  heftForBlow(hits, hero.keen);
  if (hero.keen && hits > 0) heavyLanded(hits);
}
