import { hero } from "../../../game/state";
import { VALOR } from "../constants/kit";
import type { AldricMoveId } from "../types/moves";
import { ALDRIC_MOVES } from "./moves";
import { radiantWave } from "./radiance";
import { aldric } from "./state";
import { gainValor } from "./valor";

/** a blow of the string is out: the Shield bash fills Valor, and while Radiance runs a landed blow throws its wave */
export function afterStrike(id: AldricMoveId, hits: number): void {
  if (hero.hitIndex === 1) aldric.waved = false;
  if (!hits) return;
  if (id === "shieldBash") gainValor(VALOR.shieldBash);
  if (hero.hitIndex >= ALDRIC_MOVES[id].hits.length) radiantWave();
}
