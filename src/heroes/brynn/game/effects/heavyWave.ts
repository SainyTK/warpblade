import { RES, W } from "../../../../constants/stage";
import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { type Payoff, payoffLands } from "../../../../game/skills/payoff";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

/** a returning crescent turns this close to the stage's edge */
const EDGE = 6;
/** the crescent's half height, its bow, its thickness and its speed */
const ARC = { half: 13, bow: 4, thick: 3, speed: 320 } as const;

/** what a crescent wave does: where it starts, which way, how far, what it deals and to whom */
export interface CrescentWave {
  x: number;
  y: number;
  face: number;
  reach: number;
  damage: number;
  source?: SourceId;
  /** a precise skill's crescent cuts only the foe its pull-off pays off on */
  payoff?: Payoff;
  /** taller and brighter, for the spells and evolutions that throw a bigger one */
  scale?: number;
  /** it turns at the end of its flight and cuts back through the line, each foe once more */
  back?: boolean;
  onHit?: (e: Enemy) => void;
}

/**
 * A tall crimson crescent thrown off the blade by a heavy swing, flying ahead at chest height and cutting each foe it
 * passes once. It is not a sword blow, so guards do not stop it.
 */
export function createCrescentWave(c: CrescentWave): Effect {
  const k0 = c.scale ?? 1;
  const half = ARC.half * k0;
  let struck = new Set<Enemy>();
  const o = { run: 0, dir: 1 };
  return {
    update(dt) {
      o.run += ARC.speed * dt * o.dir;
      const out = c.x + c.face * o.run;
      if (c.back && o.dir > 0 && (o.run >= c.reach || out < EDGE || out > W - EDGE)) {
        o.dir = -1;
        struck = new Set<Enemy>();
      }
      const x = c.x + c.face * o.run;
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit([x - 4, c.y - half, x + 4, c.y + half], enemyBox(e))) continue;
        struck.add(e);
        if (c.payoff && !payoffLands(c.payoff, e)) continue;
        dealDamage(e, c.damage, { fromX: x - c.face * o.dir * 8, kx: c.face * o.dir * 70, source: c.source });
        game.fx.push(createImpact(x, c.y, c.face * o.dir, false, CRIMSON_SPARKS));
        c.onHit?.(e);
      }
      if (o.dir < 0) return o.run > 0;
      return o.run < c.reach && x > -10 && x < W + 10;
    },
    draw() {
      place();
      const x = c.x + c.face * o.run;
      const k = o.dir > 0 ? 1 - o.run / c.reach : 0.6;
      const face = c.face * o.dir;
      for (let j = -half * RES; j <= half * RES; j++) {
        const v = j / (half * RES);
        const open = 1 - v * v;
        const front = x + face * open * ARC.bow * k0;
        const thick = (1 + ARC.thick * open * k0) * (0.5 + 0.5 * k) * RES;
        for (let s = 0; s <= thick; s++) {
          const col = s === 0 ? WHITE : s < thick * 0.35 ? CRIMSON[5] : s < thick * 0.7 ? CRIMSON[4] : CRIMSON[3];
          fleck(front - (face * s) / RES, c.y + j / RES, col, s < thick * 0.7 ? 1 : k + 0.2);
        }
      }
      glow(x, c.y, 16 * k0, CRIMSON[3], 0.4 * k);
    },
  };
}
