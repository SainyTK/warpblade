import { YSRA_SKIN } from "../../../../constants/characters/ysra/look";
import type { MoveId, Situation } from "../../../../types/move";
import { skillEvolved, skillLevel, skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { isFree } from "../../actions";
import { pressAttack } from "../../combo";
import { skin } from "../../skin";
import type { YsraPart } from "../part";
import { counterReady } from "../stance/stance";
import { pickGlaive } from "./choose";
import { resetHeft, runHeft, tickHeft, watchHeft } from "./heft";
import { haftReach } from "./reach";

/** J: the next glaive blow. A fresh string's hip thrust is watched, so J held through it becomes a heft. */
export function pressGlaive(): boolean {
  const fresh = hero.chain === 0 && hero.ground && isFree();
  if (!pressAttack()) return false;
  if (fresh && hero.state === "move" && hero.move === "hipThrust") watchHeft();
  return true;
}

/** the string's middle blow: Windmill's spin when held (its last pass hooks when Skyhook is held too), otherwise the
 *  Skyhook when held, otherwise the reverse sweep */
function middleBlow(): MoveId {
  if (skillLevel("y_windmill")) return (skillValues("y_windmill").passes ?? 4) >= 5 ? "windmillFull" : "windmill";
  if (skillLevel("y_skyhook")) return "skyhook";
  return "reverseSweep";
}

/** the glaive blow J starts now, from the string's place and her skills */
export function chooseGlaive(s: Situation): MoveId | null {
  return pickGlaive(s, {
    counter: counterReady() && skillLevel("y_counter") > 0,
    airSweeps: skillValues("y_vault").sweeps ?? 1,
    middle: middleBlow(),
    warpath: skillLevel("y_warpath") > 0,
    railLunge: skillEvolved("y_heft"),
    twist: (skillValues("y_impale").twist ?? 0) > 0,
  });
}

export const GLAIVE_PART: YsraPart = {
  tick: () => {
    // a longer reach draws the glaive longer, as far as its blows reach
    skin.reach = YSRA_SKIN.reach + haftReach();
    tickHeft();
  },
  runState: runHeft,
  reset: resetHeft,
};
