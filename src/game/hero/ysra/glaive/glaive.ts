import { YSRA_SKIN } from "../../../../constants/characters/ysra/look";
import type { MoveId, Situation } from "../../../../types/move";
import { skillEvolved, skillLevel, skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { isFree } from "../../actions";
import { pressAttack } from "../../combo";
import { skin } from "../../skin";
import type { YsraPart } from "../part";
import { counterReady } from "../stance/stance";
import { type GlaiveRead, pickGlaive } from "./choose";
import { foeFar, foesInFront } from "./foes";
import { resetHeft, runHeft, tickHeft, watchHeft } from "./heft";
import { foeOverhead } from "./overhead";
import { haftReach } from "./reach";

/** J: the next glaive blow. A fresh string's hip thrust is watched, so J held through it becomes a heft. */
export function pressGlaive(): boolean {
  const fresh = hero.chain === 0 && hero.ground && isFree();
  if (!pressAttack()) return false;
  if (fresh && hero.state === "move" && hero.move === "hipThrust") watchHeft();
  return true;
}

/** Windmill's trigger: foes on both sides, a crowd of three in front from its level 7, any foe once evolved */
function windmillRead(s: Situation): Pick<GlaiveRead, "windmill" | "spins"> {
  const v = skillValues("y_windmill");
  if (!skillLevel("y_windmill")) return { windmill: "none", spins: false };
  const spins = s.surrounded || (!!v.ahead && foesInFront(60) >= 3) || !!v.lone;
  return { windmill: v.passes >= 5 ? "full" : "spin", spins };
}

/** the glaive blow J starts now, from the situation and what only the glaive reads */
export function chooseGlaive(s: Situation): MoveId | null {
  const hook = skillValues("y_skyhook");
  return pickGlaive(s, {
    counter: counterReady() && skillLevel("y_counter") > 0,
    overhead: hero.ground && foeOverhead(hook.reach ?? 0),
    hook: skillLevel("y_skyhook") > 0,
    far: hero.ground && foeFar(),
    airSweeps: skillValues("y_vault").sweeps ?? 1,
    ...windmillRead(s),
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
