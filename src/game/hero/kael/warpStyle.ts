import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { createSlash } from "../../effects/slash";
import { drawThrownSword } from "../../effects/thrownWeapon";
import { meleeHit } from "../../meleeHit";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { boxAhead, boxBehind } from "../../world";
import { THRUST_SLASH } from "../moves/slashes";
import { sharedWarpStrike, warpSlash } from "../warp";
import { startChain } from "./blink";
import { spellwarpArrived } from "./spellwarp";

const SKILL = "k_warpcraft";
/** Warpcraft's thrust: the arrival drives the foe this hard and bounces it off a wall */
const THRUST_KICK = 380;

/** Kael's arrival: the shared slash, with Warpcraft a thrust that drives the foe off a wall, and later a cut behind too */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  const v = skillValues(SKILL);
  if (!v.thrust && !v.behind) return sharedWarpStrike(power, foe, sureCrit);
  warpSlash();
  if (v.thrust) game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...THRUST_SLASH, R: 26, W: 7 }));
  const boxes = v.behind ? [boxAhead(-6, -40, 30, 2), boxBehind(-6, -40, 30, 2)] : [boxAhead(-6, -40, 30, 2)];
  meleeHit(boxes, { power, kx: v.thrust ? THRUST_KICK : 160, ky: -80, big: true, wall: !!v.thrust, sureCrit });
}

/** Kael's warp: the crystal sword thrown, a crystal to hang from with Up held, Warpcraft's numbers, Rift Walker's chain
 *  and Spellwarp's element on arrival */
export const KAEL_WARP: WarpStyle = {
  drawThrown: drawThrownSword,
  strike,
  arrived: (foe) => {
    startChain(foe);
    spellwarpArrived(foe);
  },
  tune: () => skillValues(SKILL),
};
