import { GLACIER_BLOOM } from "../../constants/evolutions";
import { PAL, SPARKS } from "../../constants/palette";
import { ICE_FIELD } from "../../constants/spells";
import { W } from "../../constants/stage";
import { glow, hairline, place, sparkle } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { clamp, ease, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { drawCrystal } from "../hero/kael/art/crystal";
import { skillEvolved, skillValues, withCharms } from "../skills/query";
import { game, lights, particles, progress, rng } from "../state";
import { boxHit, shake, surfaceBelow } from "../world";

const SKILL = "k_frost";
/** spikes rise from LOW at the ends of the line to LOW + RISE in its middle */
const SPIKE = { low: 14, rise: 10 } as const;
/** foes this close to a spike they were not caught by are chilled, with Ice Spikes' chill */
const CHILL_REACH = 30;
const STAGGER = 0.055;
const STAND = 1.0;
/** where the first spike rises from the hero, and the gap between spikes */
const SPACING = { start: 18, gap: 15 } as const;
const SPIRE = GLACIER_BLOOM.spire;
/** the flare as a spike erupts, dim enough that a whole row of them leaves the foes in view */
const ERUPT_LIGHT = { radius: 24, strength: 0.32 } as const;
/** the frost on the floor at a spike's foot: how far it reaches each way and how solid its lower line is */
const FROST = { reach: 8, under: 0.5 } as const;

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
  /** foes beside it have been chilled */
  chilled: boolean;
  hit: Set<Enemy>;
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
      chilled: false,
      hit: new Set(),
    });
  }
  return line;
}

/** Glacier Bloom's crown: a tall faceted spire flanked by two side crystals */
function drawSpire(s: Spike, h: number, I: Ramp): void {
  const [left, right] = SPIRE.sides;
  drawCrystal(s.x - 7, s.base, h * left, 4, s.lean - 3, I, 0.75);
  drawCrystal(s.x + 7, s.base, h * right, 4, s.lean + 3, I, 0.75);
  drawCrystal(s.x, s.base, h, SPIRE.width, s.lean, I, 1);
  glow(s.x, s.base - h * 0.5, 30, I[3], 0.4);
}

/** a line of `n` spike heights, tallest in the middle */
const heightsOf = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => SPIKE.low + Math.round(SPIKE.rise * Math.sin((Math.PI * (i + 0.5)) / n)));

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
  const damage = (skillValues(SKILL).spire ?? b.power) * progress.stats.ap * power;
  for (const e of game.enemies) {
    const [ex, ey] = enemyCenter(e);
    if (e.hp <= 0 || Math.hypot(ex - s.x, ey - cy) > b.reach) continue;
    dealDamage(e, damage, { fromX: s.x, kx: Math.sign(ex - s.x) * 80, ky: -60, source: "abilities" });
    e.frozen = Math.max(e.frozen, b.freeze);
  }
  shake(b.shake, b.amp);
  sfx.shatter();
}

/** foes near a spike that it did not catch are slowed */
function chillBeside(s: Spike, seconds: number): void {
  s.chilled = true;
  for (const e of game.enemies) {
    if (e.hp <= 0 || s.hit.has(e) || Math.abs(enemyCenter(e)[0] - s.x) > CHILL_REACH) continue;
    e.chill = Math.max(e.chill, seconds);
  }
}

/** Ice Spikes held: frost spreads over the floor round Kael and slows every foe on it */
function frostField(x: number, y: number): void {
  const f = ICE_FIELD;
  const reach = withCharms("area", f.reach);
  game.fx.push(createFloorRing(x, y, reach, PAL.ice, 0.6));
  game.fx.push(createFloorRing(x, y, reach * 0.6, PAL.ice, 0.5, 0.7));
  for (let k = 0; k < 24; k++)
    particles.spawn(
      PK.FLAKE,
      x + rng.range(-reach, reach),
      y - rng.range(0, 30),
      rng.range(-20, 20),
      rng.range(-30, 0),
      rng.range(0.6, 1.2),
      {
        col: rng.pick([PAL.ice[4], PAL.ice[5]]),
        size: rng.range(1, 2),
      },
    );
  for (const e of game.enemies)
    if (e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) <= reach)
      e.chill = Math.max(e.chill, withCharms("duration", f.chill));
}

/** a row of crystal spikes erupting one after another along the floor, freezing what they touch, then shattering; held,
 *  a full row runs each way and frost slows every foe near */
export function castIce(x: number, y: number, face: number, power: number, wide: boolean): Effect {
  const I = PAL.ice;
  const v = skillValues(SKILL);
  const bloom = skillEvolved(SKILL);
  const damage = v.power * progress.stats.ap * power * (bloom ? v.bloomPower : 1);
  const freeze = withCharms("duration", v.freeze);
  const heights = heightsOf(Math.round(withCharms("amount", v.spikes)));
  const spikes = spikeLine(x, y, face, heights);
  if (bloom) {
    const crown = spikes[spikes.length - 1];
    if (crown) Object.assign(crown, { spire: true, h: SPIRE.height, stand: STAND + SPIRE.stand });
  }
  if (wide) {
    spikes.push(...spikeLine(x, y, -face, heights));
    frostField(x, surfaceBelow(x, y));
  } else if (bloom) spikes.push(...spikeLine(x, y, -face, GLACIER_BLOOM.backHeights));
  const end = Math.max(...spikes.map((s) => s.delay + s.stand), 0) + STAGGER + 0.1;
  let t = 0;
  const erupt = (s: Spike, i: number) => {
    s.on = true;
    if (s.spire) lights.add(s.x, s.base - SPIRE.height / 2, SPIRE.light, I[3], SPIRE.lightK, 0.35);
    else lights.add(s.x, s.base - 8, ERUPT_LIGHT.radius, I[3], ERUPT_LIGHT.strength, 0.35);
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
            e.frozen = Math.max(e.frozen, freeze);
            game.fx.push(createImpact(s.x, s.base - s.h * 0.6, s.dir, false, SPARKS.ice));
          }
        if (v.chill && !s.chilled && u >= 0.1) chillBeside(s, withCharms("duration", v.chill));
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
        // frost creeping out over the floor from the spike's foot
        hairline(
          s.x - FROST.reach,
          s.base - 0.25,
          s.x + FROST.reach,
          s.base - 0.25,
          I[5],
          (v) => 1 - Math.abs(v * 2 - 1),
        );
        hairline(s.x - FROST.reach * 0.6, s.base + 0.25, s.x + FROST.reach * 0.6, s.base + 0.25, I[3], FROST.under);
        if (s.spire) drawSpire(s, h, I);
        else {
          drawCrystal(s.x - 5, s.base, h * 0.5, 3, s.lean - 3, I, 0.75);
          drawCrystal(s.x + 5, s.base, h * 0.42, 3, s.lean + 3, I, 0.75);
          drawCrystal(s.x, s.base, h, 4.5, s.lean, I, 1);
          glow(s.x, s.base - h * 0.5, 18, I[3], 0.22);
        }
        if (u > 0.06 && u < 0.3) sparkle(s.x + s.lean, s.base - h, 4 * (1 - (u - 0.06) / 0.24) + 1, I[5], I[3], 0.4);
      }
    },
  };
}
