import { RES, W } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Ramp } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { DUSK_RAMP, DUSK_SPARKS } from "../../look/colors";

/** one wave of violet dusk: where it starts, which way it flies and how it climbs, and what it deals */
export interface DuskWave {
  x: number;
  y: number;
  face: number;
  /** pixels it climbs for each pixel it flies; negative rises */
  rise: number;
  damage: number;
  speed: number;
  life: number;
  /** foes it has cut, shared with the other waves of one cast so each foe is cut once */
  struck: Set<Enemy>;
  source?: SourceId;
  /** half its height in pixels */
  half?: number;
  ramp?: Ramp;
  /** a foe it cuts is also thrown up this fast */
  launch?: number;
  /** the most foes it cuts before it is spent; left out, every foe on its line */
  most?: number;
  /** told of each foe it cuts */
  cut?: (e: Enemy) => void;
}

/**
 * A thin crescent of dusk that flies ahead and cuts each foe once (Twin Crescent and the skills that send waves). It is
 * not a sword blow, so guards do not stop it. Drawn as image-pixel rows from tip to tip: a white leading edge, a violet
 * body thinning to the tips, and streaks left behind it.
 */
export function createDuskWave(w: DuskWave): Effect {
  const o = { x: w.x, y: w.y, t: 0 };
  const half = w.half ?? 8;
  const C = w.ramp ?? DUSK_RAMP;
  let cuts = 0;
  return {
    update(dt) {
      o.t += dt;
      o.x += w.face * w.speed * dt;
      o.y += w.rise * w.speed * dt;
      for (const e of game.enemies) {
        if (w.struck.has(e) || e.hp <= 0 || !boxHit([o.x - 3, o.y - half, o.x + 3, o.y + half], enemyBox(e))) continue;
        w.struck.add(e);
        dealDamage(e, w.damage, {
          fromX: o.x - w.face * 8,
          kx: w.face * 50,
          ky: -20,
          source: w.source,
          launch: w.launch,
        });
        game.fx.push(createImpact(o.x, o.y, w.face, false, DUSK_SPARKS));
        w.cut?.(e);
        cuts++;
        if (w.most && cuts >= w.most) return false;
      }
      return o.t < w.life && o.x > -10 && o.x < W + 10;
    },
    draw() {
      place();
      const k = 1 - o.t / w.life;
      const tilt = w.rise;
      for (let j = -half * RES; j <= half * RES; j++) {
        const v = j / (half * RES);
        const open = 1 - v * v;
        const row = o.y + j / RES;
        const front = o.x + w.face * (open * 4 - (tilt * j * 0.5) / RES);
        const thick = (0.6 + 2 * open) * (0.5 + 0.5 * k) * RES;
        for (let s = 0; s <= thick; s++) {
          const c = s === 0 ? WHITE : s < thick * 0.35 ? C[5] : s < thick * 0.7 ? C[4] : C[3];
          fleck(front - (w.face * s) / RES, row, c, s < thick * 0.7 ? 1 : k + 0.2);
        }
      }
      for (let i = 0; i < 3; i++) {
        const v = ((i + 0.5) / 3) * 2 - 1;
        const from = o.x + w.face * ((1 - v * v) * 4 - 2);
        const row = o.y + v * (half - 1);
        hairline(from, row, from - w.face * 9 * (1 - Math.abs(v) * 0.5), row, C[i % 2 ? 4 : 3], (u) => k * (1 - u));
      }
      glow(o.x, o.y, 12, C[3], 0.3 * k);
    },
  };
}
