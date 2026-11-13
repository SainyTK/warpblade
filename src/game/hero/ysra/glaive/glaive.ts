import { YSRA_SKIN } from "../../../../constants/characters/ysra/look";
import type { MoveId, Situation } from "../../../../types/move";
import { skillLevel, skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { settle } from "../../actions";
import { pressAttack } from "../../combo";
import { skin } from "../../skin";
import type { YsraPart } from "../part";
import { counterReady } from "../stance/stance";
import { pickGlaive } from "./choose";
import { haftReach } from "./reach";

/** J tapped: the next glaive blow; right after a parry, while she still guards, the counter thrust cuts the guard at once */
export function pressGlaive(): boolean {
  if (hero.state === "guard" && counterReady()) settle();
  return pressAttack();
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
    counter: counterReady(),
    airSweeps: skillValues("y_vault").sweeps ?? 1,
    middle: middleBlow(),
    warpath: skillLevel("y_warpath") > 0,
    twist: (skillValues("y_impale").twist ?? 0) > 0,
  });
}

export const GLAIVE_PART: YsraPart = {
  tick: () => {
    // a longer reach draws the glaive longer, as far as its blows reach
    skin.reach = YSRA_SKIN.reach + haftReach();
  },
};
