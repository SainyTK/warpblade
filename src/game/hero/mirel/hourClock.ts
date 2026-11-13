import { DIAL } from "../../../constants/mirel/look";
import { HOUR } from "../../../constants/mirel/special";
import { PAL, SAND, WORLD_COLORS } from "../../../constants/palette";
import { ULT_LEVELS } from "../../../constants/ultimate";
import { disc, glow, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
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
import { withCharms } from "../../skills/query";
import { game, lights, particles, progress, rng } from "../../state";
import { lowerField, raiseField, type TimeField } from "../../timeFields";
import { dust, hitStop, shake } from "../../world";
import { type Dial, dialArc, dialMark, drawDial, drawHand, drawHandWake, drawHub } from "./clockArt";
import { openFreeField } from "./stillfield";
import { drawStoppedRim } from "./stoppedLook";

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
  /** seconds a free Stillfield stands where it tolled, 0 for none */
  field: number;
}

/** the clock face drawn no wider than this, even when it reaches the whole screen */
const DRAWN = 150;
/** a hair past the toll, so the stop never runs out before the toll takes what it stored */
const MARGIN = 0.05;
/** seconds the face takes to open, and to fade after the toll */
const OPEN = 0.12;
const CLOSE = 0.2;
/** the inner chapter ring, as a share of the face's radius */
const CHAPTER = 0.62;

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
  lights.add(spec.x, spec.y, drawn * 0.6, PAL.hour[3], 0.5, 0.3);
  dust(spec.x, spec.floor, 12);
  if (spec.field) openFreeField(spec.x, spec.y, spec.field, withCharms("area", HOUR.field));
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
      return t < spec.stop + CLOSE;
    },
    draw() {
      for (const e of foes) drawStoppedRim(e);
    },
    drawBack() {
      place();
      const r = Math.min(spec.reach, DRAWN) * Math.min(1, t / OPEN);
      const fade = tolled ? Math.max(0, 1 - (t - spec.stop) / CLOSE) : 1;
      const flash = t < 2 / 30 || (tolled && t - spec.stop < 1 / 30);
      const dial: Dial = { x: spec.x, y: spec.y, r, a: fade, floor: spec.floor, flash };
      disc(spec.x, spec.y, r, DIAL.fill, (flash ? 0.25 : 0.16) * fade, spec.floor);
      drawDial(dial);
      // inside the bezel a second, plainer ring with its own hour marks, like the chapter ring of a tower clock
      const chapter = r * CHAPTER;
      dialArc(dial, chapter, 0, TAU, DIAL.bezelInner, fade);
      for (let i = 0; i < 12; i++) dialMark(dial, (i / 12) * TAU, chapter - 3, chapter, DIAL.minute, fade);
      const u = Math.min(1, t / spec.stop);
      // the long hand goes once round and the short hand half way, so the toll falls on the hour
      drawHandWake(dial, u, r - 8, 0.09);
      drawHand(dial, u * 0.5, r * 0.5, true);
      drawHand(dial, u, r - 8, true);
      drawHub(dial);
      glow(spec.x, spec.y, r * 0.5, DIAL.light, (flash ? 0.3 : 0.1) * fade);
    },
  };
}

/**
 * Hour of Stillness at its level: as the special, the toll deals the level's power and 30% of what was stored; its
 * ultimate skill (`v`, empty until held) stops foes longer, tolls harder, returns more, stuns and leaves a field.
 */
export function hourSpec(
  x: number,
  y: number,
  floor: number,
  reach: number,
  level: number,
  v: Readonly<Record<string, number>>,
): HourSpec {
  return {
    x,
    y,
    floor,
    reach,
    level,
    stop: v.stop ? withCharms("duration", v.stop) : HOUR.stop,
    power: v.power ?? 1,
    stored: v.stored ?? HOUR.stored,
    cap: v.endless ? Number.POSITIVE_INFINITY : (v.cap ?? HOUR.cap),
    stun: v.stun ?? 0,
    field: v.field ? withCharms("duration", v.field) : 0,
  };
}
