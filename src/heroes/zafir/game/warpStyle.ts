import { createSlash } from "../../../game/effects/slash";
import { meleeHit } from "../../../game/meleeHit";
import { skillValues } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { game, hero } from "../../../game/state";
import { boxAhead, boxBehind } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { ARRIVAL } from "../constants/warp";
import { RING_CUT } from "./moves/slashes";
import { gainWhirl } from "./whirl";
import { openWounds } from "./wounds";

const SKILL = "za_arrival";

/** he arrives spinning: the blow cuts in front and behind at the warp's own power */
function strike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  const v = skillValues(SKILL);
  const [x0, y0, x1, y1] = ARRIVAL.box;
  const reach = x1 * (v.reach ?? 1);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...RING_CUT, R: RING_CUT.R * (v.reach ?? 1), W: 9 }));
  meleeHit([boxAhead(x0, y0, reach, y1), boxBehind(x0, y0, reach, y1)], {
    power,
    kx: ARRIVAL.kx,
    ky: ARRIVAL.ky,
    big: true,
    sureCrit: sureCrit || !!v.keen,
  });
}

/** after the arrival: the foes round him bleed and his Whirl rises, more with Whirlwind Arrival */
function arrived(): void {
  const v = skillValues(SKILL);
  gainWhirl(ARRIVAL.whirl + (v.whirl ?? 0));
  const reach = ARRIVAL.box[2] * (v.reach ?? 1);
  for (const e of foesOnScreen()) if (Math.abs(e.x - hero.x) <= reach) openWounds(e, ARRIVAL.wounds + (v.wounds ?? 0));
}

/** Zafir's warp: the scimitar thrown spinning, and an arrival that cuts all round him */
export const ZAFIR_WARP: WarpStyle = {
  strike,
  arrived,
  tune: () => skillValues(SKILL),
};
