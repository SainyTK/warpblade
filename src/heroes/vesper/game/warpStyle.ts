import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { skillValues } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { boxAhead } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { TEMPO } from "../constants/tempo";
import { ARRIVE_A, ARRIVE_B } from "./moves/slashes";
import { warpArrived } from "./skills/warpSkills";
import { gainTempo } from "./tempo";

/** the arrival: she throws the long blade and keeps the short one, so she lands with both and cuts a cross; the blow is
 *  the shared one in power */
function strike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_A));
  game.fx.push(createSlash(hero.x, hero.y, hero.face, ARRIVE_B));
  meleeHit([boxAhead(-6, -40, 32, 2)], { power, kx: 120, ky: -80, big: true, sureCrit });
}

/** Vesper's warp: the long blade thrown, a two-blade cross on arrival, Tempo for it, and Thrown Dusk's numbers */
export const VESPER_WARP: WarpStyle = {
  strike,
  arrived: (foe) => {
    gainTempo(TEMPO.warp);
    warpArrived(foe);
  },
  tune: () => skillValues("ve_warp"),
};
