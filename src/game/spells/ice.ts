import { PAL, SPARKS } from "../../constants/palette";
import { W } from "../../constants/stage";
import { glow, line, place, polygon, px, sparkle } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { scale, WHITE } from "../../utils/color";
import { clamp, ease } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { enemyBox } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { game, lights, particles, progress, rng } from "../state";
import { boxHit, shake, surfaceBelow } from "../world";

const HEIGHTS = [14, 18, 22, 22, 18, 14];
/** Cryomancy runs three spikes further */
const LONG_HEIGHTS = [14, 18, 22, 24, 24, 22, 20, 17, 14];
/** damage as a multiple of ability power */
const POWER = 2.2;
const FREEZE = { normal: 2.6, cryomancy: 4.2 } as const;
const STAGGER = 0.055;
const STAND = 1.0;

interface Spike {
  x: number;
  base: number;
  h: number;
  lean: number;
  delay: number;
  on: boolean;
  gone: boolean;
  hit: Set<Enemy>;
}

/** a faceted crystal: lit left face, shaded right face, a bright ridge */
function crystal(x: number, base: number, h: number, w: number, lean: number, I: Ramp, bright: number): void {
  if (h < 1) return;
  const tip: [number, number] = [x + lean, base - h];
  polygon([[x - w, base], [x, base], tip], scale(I[4], bright));
  polygon([[x, base], [x + w, base], tip], scale(I[2], bright));
  line(x - w, base, tip[0], tip[1], scale(I[1], bright));
  line(x + w, base, tip[0], tip[1], scale(I[0], bright + 0.4));
  line(x, base, tip[0], tip[1], (u) => (u > 0.6 ? WHITE : I[5]));
}

/** a row of crystal spikes erupting one after another along the floor, freezing what they touch, then shattering */
export function castIce(x: number, y: number, face: number, power: number): Effect {
  const I = PAL.ice;
  const cryo = hasPerk("cryomancy");
  const heights = cryo ? LONG_HEIGHTS : HEIGHTS;
  const damage = POWER * progress.stats.ap * power;
  const spikes: Spike[] = [];
  for (let i = 0; i < heights.length; i++) {
    const sx = x + face * (18 + i * 15);
    if (sx < 6 || sx > W - 6) break;
    spikes.push({
      x: sx,
      base: surfaceBelow(sx, y),
      h: heights[i],
      lean: face * rng.range(0.5, 2.5),
      delay: i * STAGGER,
      on: false,
      gone: false,
      hit: new Set(),
    });
  }
  let t = 0;
  const erupt = (s: Spike, i: number) => {
    s.on = true;
    lights.add(s.x, s.base - 8, 30, I[3], 0.7, 0.35);
    for (let k = 0; k < 6; k++)
      particles.spawn(
        PK.FLAKE,
        s.x + rng.range(-5, 5),
        s.base - rng.range(0, s.h),
        rng.range(-30, 30),
        rng.range(-60, -10),
        rng.range(0.5, 1.1),
        {
          col: rng.pick([I[4], I[5]]),
          size: rng.range(1, 2),
        },
      );
    for (let k = 0; k < 3; k++)
      particles.spawn(
        PK.VAPOUR,
        s.x + rng.range(-6, 6),
        s.base - 3,
        rng.range(-12, 12),
        -rng.range(2, 8),
        rng.range(0.8, 1.4),
        { col: I[4], size: rng.range(4, 7) },
      );
    sfx.chime(i);
    shake(0.06, 1);
  };
  const shatter = (s: Spike, i: number) => {
    s.gone = true;
    for (let k = 0; k < 8; k++)
      particles.spawn(
        PK.SHARD,
        s.x + rng.range(-3, 3),
        s.base - rng.range(2, s.h),
        rng.range(-90, 90),
        rng.range(-200, -60),
        rng.range(0.6, 1.2),
        {
          col: rng.pick([I[3], I[4], I[5]]),
          size: rng.range(2, 4),
        },
      );
    for (let k = 0; k < 4; k++)
      particles.spawn(
        PK.FLAKE,
        s.x,
        s.base - rng.range(2, s.h),
        rng.range(-40, 40),
        rng.range(-50, 0),
        rng.range(0.5, 1),
        { col: I[5], size: 1.5 },
      );
    if (i === 0) sfx.shatter();
  };
  return {
    update(dt) {
      t += dt;
      spikes.forEach((s, i) => {
        const u = t - s.delay;
        if (u < 0) return;
        if (!s.on) erupt(s, i);
        if (u < 0.5)
          for (const e of game.enemies) {
            if (s.hit.has(e) || !boxHit(enemyBox(e), [s.x - 6, s.base - s.h, s.x + 6, s.base])) continue;
            s.hit.add(e);
            dealDamage(e, damage, { fromX: s.x - face * 6, kx: face * 60, ky: -90 });
            e.frozen = cryo ? FREEZE.cryomancy : FREEZE.normal;
            game.fx.push(createImpact(s.x, s.base - s.h * 0.6, face, false, SPARKS.ice));
          }
        if (!s.gone && u > STAND) shatter(s, i);
      });
      return t < STAND + spikes.length * STAGGER + 0.1;
    },
    draw() {
      place();
      for (const s of spikes) {
        const u = t - s.delay;
        if (u < 0 || s.gone) continue;
        const h = s.h * clamp(ease.outBack(clamp(u / 0.09)), 0, 1.15);
        for (let k = -7; k <= 7; k++) px(s.x + k, s.base, I[4], 0.8 - Math.abs(k) / 9);
        crystal(s.x - 5, s.base, h * 0.5, 3, s.lean - 3, I, 0.75);
        crystal(s.x + 5, s.base, h * 0.42, 3, s.lean + 3, I, 0.75);
        crystal(s.x, s.base, h, 4.5, s.lean, I, 1);
        glow(s.x, s.base - h * 0.5, 20, I[3], 0.3);
        if (u > 0.06 && u < 0.3) sparkle(s.x + s.lean, s.base - h, 4 * (1 - (u - 0.06) / 0.24) + 1, I[5], I[3], 0.4);
      }
    },
  };
}
