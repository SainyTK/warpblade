import { GRIT } from "../../../constants/hulda/grit";
import { TAUNT } from "../../../constants/hulda/taunt";
import { sfx } from "../../../services/audio";
import { createFloorRing } from "../../effects/floorRing";
import { game, hero, lights } from "../../state";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { gainGrit } from "./grit";
import { hulda } from "./memory";

/** O: stand and slap the chest twice for Grit; rooted and open the whole time */
export function pressTaunt(): boolean {
  const h = hero;
  if (!isFree() || !h.ground) return false;
  if (hulda.tauntCd > 0) {
    sfx.denied();
    return true;
  }
  hulda.tauntCd = TAUNT.cooldown;
  h.vx = 0;
  setState("taunt");
  return true;
}

/** each slap lands on its beat with a ring at her chest and a share of Grit */
export function runTaunt(dt: number): void {
  const h = hero;
  for (const beat of TAUNT.beats) {
    if (h.st < beat || h.st - dt >= beat) continue;
    gainGrit(GRIT.taunt);
    const x = h.x + h.face * 3;
    game.fx.push(createFloorRing(x, h.y - 18, 10, skin.ramp, 0.25, 0.9));
    lights.add(x, h.y - 18, 16, skin.ramp[4], 0.6, 0.12);
    sfx.hit(false, 0.55);
  }
  if (h.st >= TAUNT.dur) settle();
}
