import { YSRA_SKIN } from "../../../../constants/characters/ysra/look";
import { SKYHOOK_GRACE } from "../../../../constants/ysra/glaive";
import type { MoveId, Situation } from "../../../../types/move";
import { hero } from "../../../state";
import { isFree } from "../../actions";
import { pressAttack } from "../../combo";
import { skin } from "../../skin";
import type { YsraPart } from "../part";
import { counterReady } from "../stance/stance";
import { pickGlaive } from "./choose";
import { resetHeft, runHeft, tickHeft, watchHeft } from "./heft";
import { foeOverhead } from "./overhead";
import { haftReach } from "./reach";
import { noteFloor } from "./takeoff";

/** J: the next glaive blow. A fresh string's hip thrust is watched, so J held through it becomes a heft. */
export function pressGlaive(): boolean {
  const fresh = hero.chain === 0 && hero.ground && isFree();
  if (!pressAttack()) return false;
  if (fresh && hero.state === "move" && hero.move === "hipThrust") watchHeft();
  return true;
}

/** the glaive blow J starts now, from the situation and what only the glaive reads */
export function chooseGlaive(s: Situation): MoveId | null {
  return pickGlaive(s, {
    counter: counterReady(),
    rising: hero.state === "jump" && hero.st < SKYHOOK_GRACE,
    overhead: hero.ground && foeOverhead(),
  });
}

export const GLAIVE_PART: YsraPart = {
  tick: () => {
    // Long Haft draws the glaive longer, as far as its blows reach
    skin.reach = YSRA_SKIN.reach + haftReach();
    noteFloor();
    tickHeft();
  },
  runState: runHeft,
  reset: resetHeft,
};
