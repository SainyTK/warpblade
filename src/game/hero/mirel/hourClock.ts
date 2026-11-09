import { HOUR } from "../../../constants/mirel/special";
import { PAL, SAND, WORLD_COLORS } from "../../../constants/palette";
import { ULT_LEVELS } from "../../../constants/ultimate";
import { circle, disc, glow, place, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Color } from "../../../types/color";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { stopFoe, takeStored } from "../../enemies/timeStop";
import { game, lights, particles, progress, rng } from "../../state";
import { lowerField, raiseField, type TimeField } from "../../timeFields";
import { dust, hitStop, shake } from "../../world";

/** what one clock does: how long foes stop, what the toll deals, and what of the stored damage it adds */
export interface HourSpec {
  x: number;
  y: number;
  /** the floor under her, for the dust of the toll */
  floor: number;
  reach: number;
  level: number;
  stop: number;
  /** share of the level's power every foe takes at the toll */
  power: number;
  /** share of the stored damage added, and its cap in multiples of the level's power (none when not finite) */
  stored: number;
  cap: number;
  /** seconds the toll stuns */
  stun: number;
}

/** the clock face drawn no wider than this, even when it reaches the whole screen */
const DRAWN = 150;
/** a hair past the toll, so the stop never runs out before the toll takes what it stored */
const MARGIN = 0.05;

/** the toll: each stopped foe takes the level's power and part of what it took while stopped */
function toll(spec: HourSpec, foes: readonly Enemy[]): void {
  const power = ULT_LEVELS[Math.max(0, spec.level - 1)].power * progress.stats.ap;
  for (const e of foes) {
    if (e.hp <= 0) continue;
    const stored = Math.min(takeStored(e) * spec.stored, spec.cap * power);
    e.stopped = 0;
    const [cx, cy] = enemyCenter(e);
    dealDamage(e, power * spec.power + stored, {
      fromX: spec.x,
      kx: Math.sign(cx - spec.x) * 90,
      ky: -50,
      heavy: true,
      stun: spec.stun || undefined,
      source: "ultimate",
    });
    game.fx.push(
      createImpact(cx, cy, Math.sign(cx - spec.x) || 1, true, [WHITE, PAL.hour[5], PAL.hour[4], PAL.hour[3]]),
    );
  }
  const drawn = Math.min(spec.reach, DRAWN);
  game.fx.push(createFloorRing(spec.x, spec.floor, drawn, PAL.hour, 0.5));
  lights.add(spec.x, spec.y, drawn * 0.6, PAL.hour[4], 0.7, 0.3);
  dust(spec.x, spec.floor, 12);
  for (let i = 0; i < 24; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(60, 160);
    particles.spawn(PK.MOTE, spec.x, spec.y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.4, 0.8), {
      col: rng.chance(0.5) ? SAND.light : rng.chance(0.5) ? PAL.hour[4] : WORLD_COLORS.dust,
      size: 0.7,
    });
  }
  hitStop(0.08);
  shake(0.3, 4);
  sfx.boom();
  sfx.chime(4);
}

/**
 * A clock face opens round her: every foe inside stops, every foe shot inside freezes, two hands sweep a full turn, and
 * the toll lands on every foe it stopped.
 */
export function createHourClock(spec: HourSpec): Effect {
  const foes = game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [cx, cy] = enemyCenter(e);
    return Math.hypot(cx - spec.x, cy - spec.y) <= spec.reach;
  });
  for (const e of foes) stopFoe(e, spec.stop + MARGIN, 0);
  const shots: TimeField = {
    at: () => spec,
    radius: () => spec.reach,
    pace: { minion: 1, mini: 1, boss: 1, shot: 0 },
  };
  raiseField(shots);
  let t = 0;
  let tolled = false;
  return {
    update(dt) {
      t += dt;
      if (!tolled && t >= spec.stop) {
        tolled = true;
        lowerField(shots);
        toll(spec, foes);
      }
      return t < spec.stop + 0.2;
    },
    draw() {},
    drawBack() {
      place();
      const r = Math.min(spec.reach, DRAWN);
      const open = Math.min(1, t / 0.12);
      const fade = tolled ? Math.max(0, 1 - (t - spec.stop) / 0.2) : 1;
      const rr = r * open;
      const flash = t < 2 / 30 || (tolled && t - spec.stop < 1 / 30);
      const ring = flash ? WHITE : PAL.hour[3];
      // the floor stands in front of the clock's lower part
      const dot = (x: number, y: number, c: Color, a: number): void => {
        if (y < spec.floor) px(x, y, c, a);
      };
      const ray = (a: number, from: number, to: number, c: Color): void => {
        for (let k = from; k <= to; k += 0.7) dot(spec.x + Math.cos(a) * k, spec.y + Math.sin(a) * k, c, fade);
      };
      const steps = Math.max(48, Math.round(TAU * rr));
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * TAU;
        dot(spec.x + Math.cos(a) * rr, spec.y + Math.sin(a) * rr, ring, 0.9 * fade);
        dot(spec.x + Math.cos(a) * (rr - 3), spec.y + Math.sin(a) * (rr - 3), PAL.hour[2], 0.5 * fade);
      }
      for (let i = 0; i < 12; i++) {
        const a = -Math.PI / 2 + (i / 12) * TAU;
        ray(a, i % 3 ? rr - 6 : rr - 9, rr - 3, i % 3 ? PAL.hour[4] : PAL.hour[5]);
      }
      const u = Math.min(1, t / spec.stop);
      ray(-Math.PI / 2 + u * TAU, 0, rr - 8, PAL.hour[5]);
      ray(-Math.PI / 2 + u * Math.PI, 0, rr * 0.5, PAL.hour[4]);
      circle(spec.x, spec.y, 2, PAL.hour[5], fade);
      disc(spec.x, spec.y, rr, PAL.hour[2], (flash ? 0.25 : 0.08) * fade, spec.floor);
      glow(spec.x, spec.y, rr * 0.5, PAL.hour[3], (flash ? 0.3 : 0.1) * fade);
    },
  };
}

/** Hour of Stillness at its level, as the special: the toll deals the level's power and 30% of what was stored */
export function hourSpec(x: number, y: number, floor: number, reach: number, level: number): HourSpec {
  return { x, y, floor, reach, level, stop: HOUR.stop, power: 1, stored: HOUR.stored, cap: HOUR.cap, stun: 0 };
}
