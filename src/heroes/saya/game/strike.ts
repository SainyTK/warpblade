import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { MoveHit } from "../../../types/move";
import { STRING_POWER } from "../constants/string";
import { drawReach, drawStore, gainBreath } from "./focus";
import { STORE_ANGLE } from "./moves/slashes";
import { releaseCuts, releasing, storeCut } from "./store";

/** the moves that store a cut in each foe they strike, and what each stores */
const STORING: Readonly<Record<string, number>> = {
  drawCut: STRING_POWER.drawCut.store,
  returnCut: STRING_POWER.returnCut.store,
  airDraw: STRING_POWER.airDraw.store,
};

/** a draw that spends a breath reaches farther: its box and its stroke grow */
export function shapeHit(id: string, hit: MoveHit): MoveHit {
  const more = id === "drawCut" || id === "airDraw" ? drawReach() : 0;
  if (!more) return hit;
  const [x0, y0, x1, y1] = hit.box;
  const slash = hit.slash ? { ...hit.slash, R: hit.slash.R + more * 0.6, W: hit.slash.W + 2 } : undefined;
  return { ...hit, box: [x0, y0, x1 + more, y1], slash };
}

/** one of her own hits landed: a string blow stores its cut in the foe, unless the blow felled it */
export function landed(e: Enemy, hit: { crit: boolean; kill: boolean }): void {
  if (releasing() || hit.kill || hero.state !== "move" || !hero.move) return;
  const store = STORING[hero.move];
  if (!store) return;
  const angle = STORE_ANGLE[hero.move as keyof typeof STORE_ANGLE];
  storeCut(e, progress.stats.ad * store * (hero.move === "returnCut" ? 1 : drawStore()), angle);
}

/** the sheathe's click has struck: every stored cut releases in full; a clean sheathe makes them sure crits and gives a
 *  breath */
export function afterStrike(id: string): void {
  if (id !== "sheathe") return;
  releaseCuts(true, hero.keen);
  if (hero.keen) gainBreath();
}
