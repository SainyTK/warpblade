import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { JADE, JADE_SPARKS } from "../../look";

/** what the shade does: its foe, its cuts and their damage, and what its last cut leaves */
export interface ShadeCuts {
  foe: Enemy;
  cuts: number;
  damage: number;
  source: string;
  /** after the last cut */
  done: () => void;
}

/** the shade appears this far behind its foe, cuts this often after a short wind-up, and fades over this long */
const SHADE = { behind: 14, windup: 0.12, every: 0.14, fade: 0.25 } as const;
const CUT = { cx: 4, cy: -20, R: 20, sy: 0.6, rot: -0.2, a0: -2.4, a1: 0.9, W: 6, trail: 0.18 } as const;

/** Sage's Shade: a jade shade of Yun steps out behind the foe, winds up and cuts it, then fades */
export function createShade(o: ShadeCuts): Effect {
  const side = o.foe.face || 1;
  const x = o.foe.x - side * SHADE.behind;
  const face = side;
  const y = o.foe.y;
  let t = 0;
  let cut = 0;
  const end = SHADE.windup + SHADE.every * o.cuts + SHADE.fade;
  return {
    update(dt) {
      t += dt;
      while (cut < o.cuts && t >= SHADE.windup + SHADE.every * cut) {
        cut++;
        game.fx.push(
          createSlash(x, y, face, { ...CUT, a0: cut % 2 ? CUT.a0 : CUT.a1, a1: cut % 2 ? CUT.a1 : CUT.a0, ramp: JADE }),
        );
        if (o.foe.hp > 0) {
          dealDamage(o.foe, o.damage, { source: o.source, fromX: x, kx: face * 40, ky: -20 });
          game.fx.push(createImpact(...enemyCenter(o.foe), face, true, JADE_SPARKS));
        }
        if (cut === o.cuts) o.done();
      }
      return t < end;
    },
    draw() {
      place();
      const k = t > end - SHADE.fade ? (end - t) / SHADE.fade : Math.min(1, t / 0.06);
      const a = 0.6 * k;
      hairline(x, y, x - face * 2, y - 10, JADE[3], a);
      hairline(x + face * 1, y, x + face * 3, y - 10, JADE[3], a);
      hairline(x, y - 10, x + face * 1, y - 21, JADE[4], a);
      hairline(x + face * 1, y - 19, x + face * 7, y - 16, JADE[4], a);
      hairline(x + face * 7, y - 16, x + face * 18, y - 20, JADE[5], a);
      fleck(x + face * 1.5, y - 24, JADE[5], a + 0.2);
      fleck(x + face * 0.5, y - 27, JADE[4], a);
      glow(x, y - 14, 12, JADE[3], 0.3 * k);
    },
  };
}
