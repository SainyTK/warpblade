import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, glowLine, hairline, line, place, sparkle } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, TAU } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, hero, particles, rng } from "../../state";
import { shake } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";
import { unblinkingPupil } from "./unblinkingPose";

/**
 * The gaze of The Unblinking, and the one way to defeat it.
 *
 * The eye gathers its sight for `warn` seconds at one edge of the stage, then a wall of sight crosses the whole stage
 * in `cross` seconds, floor to sky. It cannot be jumped. The wall burns whatever it finds, and it finds what moves:
 * a hero walking, jumping, attacking, dashing or casting as the wall reaches them is seen and burned.
 *
 * A hero who has stood still on the floor for `still` seconds when the wall reaches them is not seen, and takes
 * nothing. When a gaze crosses the stage and finds no one, the eye strains (e.n counts it, and its lid droops). At
 * `strain` such gazes in a row the lid shuts and the eye falls to the floor, where it can be hurt until it opens
 * again (unblinking.ts). A gaze that finds anyone clears the strain.
 *
 * The game never says this. The patch notes only hint at it.
 */
export const GAZE = { warn: 1.5, cross: 1.4, still: 1, strain: 2, half: 3 } as const;

/** the hero in play stands still on the floor, and has for long enough */
const standsStill = (): boolean => hero.ground && hero.state === "idle" && hero.st >= GAZE.still;

/** the eye's lid shuts and it drops out of the air */
function shutEye(e: Enemy): void {
  Object.assign(e, { state: "blink", st: 0, n: 0, vx: 0, vy: 0 });
  shake(0.5, 4);
  sfx.shatter();
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.SPARK,
      e.x + rng.range(-18, 18),
      e.y + rng.range(-10, 10),
      rng.range(-90, 90),
      rng.range(-120, 40),
      0.5,
      {
        sparks: VOID_SPARKS,
      },
    );
}

/** one gaze of the eye `e`, from its warning to the wall's far edge; it ends the eye's `charge` and `volley` states itself */
export function createGaze(e: Enemy, damage: number): Effect {
  const dir = e.side;
  const from = dir > 0 ? -GAZE.half : W + GAZE.half;
  let t = 0;
  let x = from;
  /** heroes the wall has reached, by seat, and whether it found any of them */
  const reached = new Set<number>();
  let found = false;
  return {
    update(dt) {
      if (e.hp <= 0 || (e.state !== "charge" && e.state !== "volley")) return false;
      t += dt;
      if (t < GAZE.warn) return true;
      if (e.state === "charge") {
        Object.assign(e, { state: "volley", st: 0 });
        sfx.lunge();
      }
      x = from + dir * ((t - GAZE.warn) / GAZE.cross) * (W + GAZE.half * 2);
      eachStanding(() => {
        if (reached.has(heroSlot()) || (x - hero.x) * dir < 0) return;
        reached.add(heroSlot());
        if (standsStill()) return;
        found = true;
        hurtHero(damage, x - dir * 8);
      });
      if (rng.chance(0.7))
        particles.spawn(PK.SPARK, x, GROUND - 1, rng.range(-30, 30), rng.range(-80, -20), 0.25, {
          sparks: VOID_SPARKS,
        });
      if (t < GAZE.warn + GAZE.cross) return true;
      e.n = reached.size > 0 && !found ? e.n + 1 : 0;
      if (e.n >= GAZE.strain) shutEye(e);
      else {
        Object.assign(e, { state: "recover", st: 0 });
        if (e.n > 0) sfx.chime(2);
      }
      return false;
    },
    drawBack() {
      place();
      const [px, py] = unblinkingPupil(e, game.t);
      if (t < GAZE.warn) drawSightFan(px, py, dir > 0 ? 0 : W, 0.1 + 0.25 * (t / GAZE.warn));
      else drawSightFan(px, py, x, 0.35 * fadeOut(t));
    },
    draw() {
      place();
      const [px, py] = unblinkingPupil(e, game.t);
      if (t < GAZE.warn) drawGathering(px, py, dir, t);
      else drawWall(px, py, x, dir, fadeOut(t));
    },
  };
}

/** the wall fades out over its last this many seconds */
const FADE = 0.2;
const fadeOut = (t: number): number => clamp((GAZE.warn + GAZE.cross - t) / FADE);
/** the gathering sight throbs like a heartbeat, from this many beats a second to that many as the wall comes */
const THROB = { from: 2, to: 9 } as const;
/** the curtain of sight thickening in from the edge: its widest, in art pixels, and how many motes rise through it */
const CURTAIN = { band: 14, motes: 20, rise: 70 } as const;
/** threads of sight from the pupil to the wall, spread from sky to floor */
const FAN = 6;
/** the wall's bright body each side of its core, the wake of afterimages it leaves, and their spacing */
const WALL = { body: 2, wake: 26 } as const;
/** sight pouring down the wall: how many streaks, how fast they fall and how long each is */
const POUR = { count: 14, speed: 260, long: 5 } as const;
/** flickering fringes along the wall's leading edge: how many, and how many times a second they jump */
const FRINGE = { count: 9, rate: 30 } as const;

/** dotted threads of sight from the pupil to a line on the stage, behind the fighters */
function drawSightFan(px: number, py: number, x: number, a: number): void {
  for (let i = 0; i < FAN; i++) hairline(px, py, x, (GROUND * i) / (FAN - 1), VOID[3], a);
}

/** sight gathers at the edge the wall will come from: a throbbing curtain that thickens and brightens, motes rising through it */
function drawGathering(px: number, py: number, dir: number, t: number): void {
  const k = t / GAZE.warn;
  const ex = dir > 0 ? 0 : W;
  const beats = THROB.from * t + ((THROB.to - THROB.from) * t * t) / (2 * GAZE.warn);
  const throb = 0.5 + 0.5 * Math.cos(beats * TAU);
  const band = 1 + CURTAIN.band * k;
  for (let o = 0; o < band; o++) {
    const u = o / band;
    line(
      ex + dir * (o + 0.5) - 0.5,
      0,
      ex + dir * (o + 0.5) - 0.5,
      GROUND,
      u < 0.2 ? VOID[4] : u < 0.55 ? VOID[3] : VOID[2],
      (0.35 + 0.55 * k) * (1 - u) * (0.6 + 0.4 * throb),
    );
  }
  hairline(ex + dir, 0, ex + dir, GROUND, VOID[5], 0.3 + 0.7 * k);
  for (let j = 0; j < CURTAIN.motes; j++) {
    const y = GROUND - ((game.t * CURTAIN.rise * (0.6 + grain(j, 1)) + grain(j, 2) * GROUND) % GROUND);
    fleck(ex + dir * grain(j, 3) * band * 1.2, y, j % 3 ? VOID[4] : VOID[5]);
  }
  glowLine(ex, 0, ex, GROUND, 6 + 14 * k, VOID[3], (0.25 + 0.45 * k) * (0.7 + 0.3 * throb));
  glow(ex, GROUND - 2, 10 + 8 * k, VOID[4], 0.3 + 0.3 * k);
  glow(px, py, 6 + 10 * k, VOID[4], (0.2 + 0.4 * k) * (0.7 + 0.3 * throb));
}

/**
 * The wall of sight from floor to sky: a white core in a body of void light, sight pouring down it, a flickering
 * leading edge, a wake of afterimages fading behind, and a burning foot where it meets the floor.
 */
function drawWall(px: number, py: number, x: number, dir: number, k: number): void {
  for (let w = WALL.wake; w > GAZE.half; w -= w > GAZE.half + 8 ? 2 : 1) {
    const u = (w - GAZE.half) / (WALL.wake - GAZE.half);
    line(x - dir * w, 0, x - dir * w, GROUND, u < 0.35 ? VOID[2] : VOID[1], 0.45 * (1 - u) ** 1.5 * k);
  }
  for (let o = -GAZE.half - WALL.body; o <= GAZE.half + WALL.body; o++) {
    const edge = Math.abs(o) / (GAZE.half + WALL.body);
    line(
      x + o,
      0,
      x + o,
      GROUND,
      edge > 0.75 ? VOID[3] : edge > 0.35 ? VOID[4] : VOID[5],
      (0.45 + 0.55 * (1 - edge)) * k,
    );
  }
  hairline(x, 0, x, GROUND, WHITE, k);
  hairline(x + 0.5, 0, x + 0.5, GROUND, WHITE, k);
  for (let j = 0; j < POUR.count; j++) {
    const y = ((GROUND * j) / POUR.count + game.t * POUR.speed) % GROUND;
    const ox = (grain(j, 4) - 0.5) * GAZE.half * 2;
    hairline(x + ox, y, x + ox, y + POUR.long, WHITE, 0.8 * k);
  }
  const beat = Math.floor(game.t * FRINGE.rate);
  for (let j = 0; j < FRINGE.count; j++) {
    const fx = x + dir * (GAZE.half + WALL.body + 1 + grain(j, beat) * 2.5);
    const y0 = grain(j + 11, beat) * GROUND;
    hairline(fx, y0, fx, Math.min(GROUND, y0 + 6 + grain(j + 23, beat) * 14), VOID[4], 0.9 * k);
  }
  glowLine(x, 0, x, GROUND, 20, VOID[3], 0.55 * k);
  sparkle(x, GROUND - 1, 3 + 3 * k, VOID[5], VOID[4], 0.5 * k);
  glow(x, GROUND - 2, 18, VOID[5], 0.5 * k);
  glow(px, py, 12, VOID[5], 0.5 * k);
}
