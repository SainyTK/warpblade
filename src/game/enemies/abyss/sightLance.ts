import { GROUND } from "../../../constants/stage";
import { ellipseRing, glow, glowLine, hairline, line, place, px, sparkle } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, particles, rng } from "../../state";
import { heroBox } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";
import { unblinkingPupil } from "./unblinkingPose";

/** a lance: seconds its sight line warns, seconds the beam burns, and the part of that in which it can hurt */
export const LANCE = { warn: 0.8, burn: 0.3, hurts: 0.12 } as const;

/** whether the segment from (x0, y0) to (x1, y1) passes through the hero's box, sampled every 2 art pixels */
function crossesHero(x0: number, y0: number, x1: number, y1: number): boolean {
  const [bx0, by0, bx1, by1] = heroBox();
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2);
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = y0 + ((y1 - y0) * i) / n;
    if (x > bx0 - 2 && x < bx1 + 2 && y > by0 - 2 && y < by1 + 2) return true;
  }
  return false;
}

/**
 * One lance of The Unblinking's sight: after `delay` a steady line runs from the eye to the spot `tx` on the floor,
 * with a ring where it will land; then a beam burns down it once. The spot is fixed when the lance is made, so the
 * hero steps out of it.
 */
export function createSightLance(e: Enemy, tx: number, delay: number, damage: number): Effect {
  let t = -delay;
  const hit = new Set<number>();
  const ty = GROUND - 1;
  return {
    update(dt) {
      if (e.hp <= 0 || e.state === "blink") return false;
      const before = t;
      t += dt;
      if (t < LANCE.warn) return true;
      if (before < LANCE.warn) sfx.lunge();
      if (t < LANCE.warn + LANCE.hurts)
        eachStanding(() => {
          if (hit.has(heroSlot()) || !crossesHero(e.x, e.y, tx, ty)) return;
          hit.add(heroSlot());
          hurtHero(damage, e.x);
        });
      if (rng.chance(0.8))
        particles.spawn(PK.SPARK, tx, ty, rng.range(-60, 60), rng.range(-90, -20), 0.2, { sparks: VOID_SPARKS });
      return t < LANCE.warn + LANCE.burn;
    },
    draw() {
      if (t < 0) return;
      place();
      const [sx, sy] = unblinkingPupil(e, game.t);
      if (t < LANCE.warn) drawLanceWarning(sx, sy, tx, ty, t / LANCE.warn);
      else drawLanceBurn(sx, sy, tx, ty, 1 - clamp((t - LANCE.warn) / LANCE.burn));
    },
  };
}

/** the warning's dots crawl down the sight line until this share of the warning, then it holds steady and brightens */
const STEADY_AT = 0.6;
/** how fast the warning's dots crawl, in art pixels a second, and the length of their repeat */
const CRAWL = { speed: 40, every: 8, gap: 4 } as const;
/** the ring on the floor closes from this radius to the other as the warning runs */
const AIM_RING = { from: 7, to: 4.5, ry: 0.28 } as const;
/** the beam opens wide for an instant, then narrows to a thread: the share of its burn left at each step */
const FLARE = { wide: 0.6, thread: 0.3 } as const;
/** forks of light off the burning lance: how many, and how many times a second they jump */
const FORKS = { count: 4, rate: 40 } as const;
/** the scorch spreading on the floor where it lands: its widest reach and depth */
const SCORCH = { rx: 8, ry: 1.6 } as const;

/** the sight line from the pupil to the spot it will burn, and a ring closing on that spot */
function drawLanceWarning(sx: number, sy: number, tx: number, ty: number, k: number): void {
  const len = Math.hypot(tx - sx, ty - sy) || 1;
  const ux = (tx - sx) / len;
  const uy = (ty - sy) / len;
  const steady = k >= STEADY_AT;
  for (let d = 3; d < len; d += 1) {
    if (!steady && Math.floor(d - game.t * CRAWL.speed) % CRAWL.every >= CRAWL.gap) continue;
    px(sx + ux * d, sy + uy * d, steady ? VOID[4] : VOID[3], 0.4 + 0.6 * k);
  }
  const r = AIM_RING.from + (AIM_RING.to - AIM_RING.from) * k;
  ellipseRing(tx, ty, r, r * AIM_RING.ry, VOID[5], 0.4 + 0.6 * k);
  if (steady) {
    glowLine(sx, sy, tx, ty, 4, VOID[3], 0.2);
    ellipseRing(tx, ty, r * 0.5, r * AIM_RING.ry * 0.5, VOID[4], 0.5 + 0.5 * Math.sin(game.t * 30));
  }
  glow(sx, sy, 4 + 5 * k, VOID[4], 0.35 * k);
}

/** the lance burning down from the pupil: a white core in a crimson body, forks of light and a scorch on the floor */
function drawLanceBurn(sx: number, sy: number, tx: number, ty: number, k: number): void {
  const len = Math.hypot(tx - sx, ty - sy) || 1;
  const ux = (tx - sx) / len;
  const uy = (ty - sy) / len;
  const nx = -uy;
  const ny = ux;
  const wide = k > FLARE.wide ? 2 : k > FLARE.thread ? 1 : 0;
  for (let o = -wide; o <= wide; o++) {
    if (o === 0) continue;
    line(sx + nx * o, sy + ny * o, tx + nx * o, ty + ny * o, Math.abs(o) === 2 ? VOID[3] : VOID[4], 0.4 + 0.6 * k);
  }
  line(sx, sy, tx, ty, wide > 0 ? VOID[5] : VOID[4]);
  if (wide > 0) hairline(sx + nx * 0.5, sy + ny * 0.5, tx + nx * 0.5, ty + ny * 0.5, WHITE);
  const beat = Math.floor(game.t * FORKS.rate);
  for (let j = 0; j < FORKS.count; j++) {
    const at = (0.15 + 0.85 * grain(j * 3 + 1, beat)) * len;
    const side = grain(j * 5 + 2, beat) > 0.5 ? 1 : -1;
    const reach = (2 + grain(j, beat + 7) * 3) * k;
    const fx = sx + ux * at;
    const fy = sy + uy * at;
    hairline(fx, fy, fx + nx * side * reach + ux * 2.5, fy + ny * side * reach + uy * 2.5, VOID[4], 0.9);
  }
  ellipseRing(tx, ty, SCORCH.rx * (1.2 - k), SCORCH.ry, VOID[3], 0.3 + 0.7 * k);
  glowLine(sx, sy, tx, ty, 6 + 4 * k, VOID[3], 0.5 * k);
  sparkle(tx, ty, 1.5 + 4 * k, VOID[5], VOID[4], 0.6 * k);
  glow(tx, ty, 12, VOID[5], 0.5 * k);
  glow(sx, sy, 9, VOID[5], 0.6 * k);
}
