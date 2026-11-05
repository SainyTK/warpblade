import { PYRE_COLONNADE as C } from "../../../constants/evolutions";
import { W } from "../../../constants/stage";
import { game } from "../../state";
import { surfaceBelow } from "../../world";
import { castFlamePillar } from "./flamePillar";

/** Pyre Colonnade: the evolved Flame Pillar under a ringed sigil, with two smaller sigils either side that burst into
 *  flank pillars a beat after it. `fromY` is the caster's feet, so each flank finds its own floor or ledge. */
export function castPyreColonnade(x: number, fromY: number): void {
  game.fx.push(castFlamePillar(x, surfaceBelow(x, fromY), C.main));
  for (const side of [-1, 1]) {
    const fx = x + side * C.offset;
    if (fx < C.margin || fx > W - C.margin) continue;
    game.fx.push(castFlamePillar(fx, surfaceBelow(fx, fromY), C.flank));
  }
}
