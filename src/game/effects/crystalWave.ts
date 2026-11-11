import { LANCE_LOOK } from "../../constants/kael/crystalLook";
import { PAL, SPARKS } from "../../constants/palette";
import { RES, W } from "../../constants/stage";
import { fleck, glow, hairline, place } from "../../engine/frame";
import type { SourceId } from "../../types/build";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { grain } from "../../utils/grain";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { type Payoff, payoffLands } from "../skills/payoff";
import { game } from "../state";
import { boxHit } from "../world";
import { createImpact } from "./impact";

const SPEED = 250;
const LIFE = 0.6;
const HALF = 9;

/** a crescent of crystal that flies forward and cuts each foe once (Crystal Lance, Keen Edge's wave); it is not a sword
 *  blow, so guards do not stop it. A precise skill's wave carries its pull-off's payoff and cuts only the foes it lands
 *  on, passing the others by */
export function createCrystalWave(
  x: number,
  y: number,
  face: number,
  damage: number,
  source?: SourceId,
  payoff?: Payoff,
): Effect {
  const o = { x, t: 0 };
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      o.x += face * SPEED * dt;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit([o.x - 3, y - HALF, o.x + 3, y + HALF], enemyBox(e))) continue;
        struck.add(e);
        if (payoff && !payoffLands(payoff, e)) continue;
        dealDamage(e, damage, { fromX: o.x - face * 8, kx: face * 60, source });
        game.fx.push(createImpact(o.x, y, face, false, SPARKS.crystal));
      }
      return o.t < LIFE && o.x > -10 && o.x < W + 10;
    },
    draw() {
      place();
      const k = 1 - o.t / LIFE;
      const C = PAL.crystal;
      const L = LANCE_LOOK;
      // image pixel rows from tip to tip: a white leading edge, a body that thins toward the tips, a dithered back
      for (let j = -HALF * RES; j <= HALF * RES; j++) {
        const v = j / (HALF * RES);
        const open = 1 - v * v;
        const front = o.x + face * open * L.bow;
        const thick = (L.thin + (L.thick - L.thin) * open) * (0.5 + 0.5 * k) * RES;
        const row = y + j / RES;
        for (let s = 0; s <= thick; s++) {
          const c = s === 0 ? WHITE : s < thick * 0.35 ? C[5] : s < thick * 0.7 ? C[4] : C[3];
          fleck(front - (face * s) / RES, row, c, s < thick * 0.7 ? 1 : k + 0.2);
        }
      }
      // streaks left behind it, each a fixed row of the crescent
      for (let i = 0; i < L.streaks; i++) {
        const v = ((i + 0.5) / L.streaks) * 2 - 1;
        const from = o.x + face * ((1 - v * v) * L.bow - L.thick);
        const len = L.tail * (0.4 + 0.6 * grain(i, 3)) * (1 - Math.abs(v) * 0.5);
        const row = y + v * (HALF - 1);
        hairline(from, row, from - face * len, row, C[i % 2 ? 4 : 3], (u) => k * (1 - u));
      }
      fleck(o.x + face * (L.bow + 0.5), y, WHITE);
      glow(o.x, y, 14, C[3], 0.35 * k);
    },
  };
}
