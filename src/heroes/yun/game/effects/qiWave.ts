import { RES, W } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { JADE, JADE_SPARKS } from "../../look";

/** how a qi wave flies: pixels it runs, its speed, damage to each foe it cuts, its half height, and what dealt it */
export interface QiWaveShape {
  reach: number;
  speed: number;
  damage: number;
  half: number;
  source?: SourceId;
  /** knocks the foes it cuts off their feet for this long */
  stun?: number;
}

/** how far the crescent bows forward at its middle, its thickness, and the streaks it leaves */
const BOW = 4;
const THICK = 2.6;
const STREAKS = 5;

/**
 * A crescent of jade qi that leaves Yun's blade and runs straight ahead, cutting each foe it passes once; it is not a
 * sword blow, so guards do not stop it. Deflecting Qi sends one at chest height; Returning Tide runs one along the floor.
 */
export function createQiWave(x: number, y: number, face: number, shape: QiWaveShape): Effect {
  const o = { x, t: 0 };
  const life = shape.reach / shape.speed;
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      o.x += face * shape.speed * dt;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0) continue;
        if (!boxHit([o.x - 3, y - shape.half, o.x + 3, y + shape.half], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, shape.damage, {
          fromX: o.x - face * 8,
          kx: face * 70,
          ky: shape.stun ? -40 : -10,
          stun: shape.stun,
          source: shape.source,
        });
        game.fx.push(createImpact(o.x, y, face, false, JADE_SPARKS));
      }
      return o.t < life && o.x > -10 && o.x < W + 10;
    },
    draw() {
      place();
      const k = 1 - o.t / life;
      const half = shape.half;
      for (let j = -half * RES; j <= half * RES; j++) {
        const v = j / (half * RES);
        const open = 1 - v * v;
        const front = o.x + face * open * BOW;
        const thick = (0.8 + THICK * open) * (0.45 + 0.55 * k) * RES;
        const row = y + j / RES;
        for (let s = 0; s <= thick; s++) {
          const c = s === 0 ? WHITE : s < thick * 0.35 ? JADE[5] : s < thick * 0.7 ? JADE[4] : JADE[3];
          fleck(front - (face * s) / RES, row, c, s < thick * 0.7 ? 1 : k + 0.2);
        }
      }
      for (let i = 0; i < STREAKS; i++) {
        const v = ((i + 0.5) / STREAKS) * 2 - 1;
        const from = o.x + face * ((1 - v * v) * BOW - THICK);
        const len = 10 * (0.4 + 0.6 * grain(i, 7)) * (1 - Math.abs(v) * 0.5);
        const row = y + v * (half - 1);
        hairline(from, row, from - face * len, row, JADE[i % 2 ? 4 : 3], (u) => k * (1 - u));
      }
      glow(o.x, y, 12, JADE[3], 0.32 * k);
    },
  };
}
