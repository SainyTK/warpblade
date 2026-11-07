import { GLACIER_BLOOM } from "../../constants/evolutions";
import { PAL, SPARKS } from "../../constants/palette";
import { W } from "../../constants/stage";
import { glow, line, place, polygon, px, sparkle } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { scale, WHITE } from "../../utils/color";
import { clamp, ease, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { enemyBox, enemyCenter } from "../enemies/enemy";
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
/** where the first spike rises from the hero, and the gap between spikes */
const SPACING = { start: 18, gap: 15 } as const;
const SPIRE = GLACIER_BLOOM.spire;

interface Spike {
  x: number;
  base: number;
  h: number;
  lean: number;
  delay: number;
  /** the side it runs to: the hero's facing for the front line, the other way for Glacier Bloom's back line */
  dir: number;
  /** seconds it stands before it shatters */
  stand: number;
  /** Glacier Bloom's crown spire */
  spire: boolean;
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

/** spikes running from x along `dir`, one after another, stopping at the stage edge */
function spikeLine(x: number, y: number, dir: number, heights: readonly number[]): Spike[] {
  const line: Spike[] = [];
  for (let i = 0; i < heights.length; i++) {
    const sx = x + dir * (SPACING.start + i * SPACING.gap);
    if (sx < 6 || sx > W - 6) break;
    line.push({
      x: sx,
      base: surfaceBelow(sx, y),
      h: heights[i],
      lean: dir * rng.range(0.5, 2.5),
      delay: i * STAGGER,
      dir,
      stand: STAND,
      spire: false,
      on: false,
      gone: false,
      hit: new Set(),
    });
  }
  return line;
}

/** Glacier Bloom's crown: a tall faceted spire flanked by two side crystals */
function drawSpire(s: Spike, h: number, I: Ramp): void {
  const [left, right] = SPIRE.sides;
  crystal(s.x - 7, s.base, h * left, 4, s.lean - 3, I, 0.75);
  crystal(s.x + 7, s.base, h * right, 4, s.lean + 3, I, 0.75);
  crystal(s.x, s.base, h, SPIRE.width, s.lean, I, 1);
  glow(s.x, s.base - h * 0.5, 30, I[3], 0.4);
}

/** the spire shatters into freezing shards: a white flash, shards in a full circle, and foes near its middle hit and frozen */
function burstSpire(s: Spike, power: number): void {
  const I = PAL.ice;
  const b = GLACIER_BLOOM.burst;
  const cy = s.base - s.h / 2;
  lights.add(s.x, cy, b.light, I[4], 1, 0.3);
  lights.add(s.x, cy, 16, WHITE, 0.9, 0.1);
  for (let k = 0; k < b.shards; k++) {
    const a = (k / b.shards) * TAU + rng.range(-0.2, 0.2);
    const sp = rng.range(120, 220);
    particles.spawn(PK.SHARD, s.x, cy, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.5, 0.9), {
      col: rng.pick([I[3], I[4], I[5]]),
      size: rng.range(2, 4),
    });
  }
  const damage = b.power * progress.stats.ap * power;
  for (const e of game.enemies) {
    const [ex, ey] = enemyCenter(e);
    if (e.hp <= 0 || Math.hypot(ex - s.x, ey - cy) > b.reach) continue;
    dealDamage(e, damage, { fromX: s.x, kx: Math.sign(ex - s.x) * 80, ky: -60, source: "abilities" });
    e.frozen = Math.max(e.frozen, b.freeze);
  }
  shake(b.shake, b.amp);
  sfx.shatter();
}

/** a row of crystal spikes erupting one after another along the floor, freezing what they touch, then shattering */
export function castIce(x: number, y: number, face: number, power: number): Effect {
  const I = PAL.ice;
  const cryo = hasPerk("cryomancy");
  const heights = cryo ? LONG_HEIGHTS : HEIGHTS;
  const damage = POWER * progress.stats.ap * power;
  const bloom = hasPerk("glacierBloom");
  const spikes = spikeLine(x, y, face, heights);
  if (bloom) {
    const crown = spikes[spikes.length - 1];
    if (crown) Object.assign(crown, { spire: true, h: SPIRE.height, stand: STAND + SPIRE.stand });
    spikes.push(...spikeLine(x, y, -face, GLACIER_BLOOM.backHeights));
  }
  const end = Math.max(...spikes.map((s) => s.delay + s.stand), 0) + STAGGER + 0.1;
  let t = 0;
  const erupt = (s: Spike, i: number) => {
    s.on = true;
    if (s.spire) lights.add(s.x, s.base - SPIRE.height / 2, SPIRE.light, I[3], SPIRE.lightK, 0.35);
    else lights.add(s.x, s.base - 8, 30, I[3], 0.7, 0.35);
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
    if (s.dir === face) sfx.chime(i);
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
    if (s.spire) burstSpire(s, power);
  };
  return {
    update(dt) {
      t += dt;
      spikes.forEach((s, i) => {
        const u = t - s.delay;
        if (u < 0) return;
        if (!s.on) erupt(s, i);
        const reach = s.spire ? SPIRE.width : 6;
        if (u < 0.5)
          for (const e of game.enemies) {
            if (s.hit.has(e) || !boxHit(enemyBox(e), [s.x - reach, s.base - s.h, s.x + reach, s.base])) continue;
            s.hit.add(e);
            dealDamage(e, damage, { fromX: s.x - s.dir * 6, kx: s.dir * 60, ky: -90, source: "abilities" });
            e.frozen = cryo ? FREEZE.cryomancy : FREEZE.normal;
            game.fx.push(createImpact(s.x, s.base - s.h * 0.6, s.dir, false, SPARKS.ice));
          }
        if (!s.gone && u > s.stand) shatter(s, i);
      });
      return t < end;
    },
    draw() {
      place();
      for (const s of spikes) {
        const u = t - s.delay;
        if (u < 0 || s.gone) continue;
        const h = s.h * clamp(ease.outBack(clamp(u / 0.09)), 0, 1.15);
        for (let k = -7; k <= 7; k++) px(s.x + k, s.base, I[4], 0.8 - Math.abs(k) / 9);
        if (s.spire) drawSpire(s, h, I);
        else {
          crystal(s.x - 5, s.base, h * 0.5, 3, s.lean - 3, I, 0.75);
          crystal(s.x + 5, s.base, h * 0.42, 3, s.lean + 3, I, 0.75);
          crystal(s.x, s.base, h, 4.5, s.lean, I, 1);
          glow(s.x, s.base - h * 0.5, 20, I[3], 0.3);
        }
        if (u > 0.06 && u < 0.3) sparkle(s.x + s.lean, s.base - h, 4 * (1 - (u - 0.06) / 0.24) + 1, I[5], I[3], 0.4);
      }
    },
  };
}
