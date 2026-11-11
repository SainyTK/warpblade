import { GROUND } from "../../../constants/stage";
import { ellipseRing, fleck, glow, glowLine, hairline, line, place, polygon, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox, shake } from "../../world";
import { AC, VOID, VOID_SPARKS } from "./colors";

/** a pillar: a ring warns on the floor, then the light comes down, can hurt for a moment, and thins away */
export const PILLAR = { warn: 0.8, hurts: 0.14, fade: 0.26, half: 8 } as const;

/** the warning on the floor: how much wider the outer ring starts, and how flat the floor's ellipses are */
const RING = { far: 11, flat: 0.24 } as const;
/** the tear that opens in the sky over the pillar's line: its half width at the start and fully open */
const SKY_TEAR = { start: 1, open: 5 } as const;
/** the warning's last share, when the seam on the floor burns white and the thread to the sky thickens */
const ABOUT_TO = 0.75;
/** the strike's first share, when it comes down at full width with a flash around it */
const FLASH = 0.18;
/** the splash where the pillar meets the floor: how far its tongues of light reach out and up */
const SPLASH = { out: 7, up: 6 } as const;

/** the opening on the floor that warns of a pillar: a ring tightening onto it, a dark lens with a hot seam, motes */
function drawWarning(x: number, k: number, t: number): void {
  const half = PILLAR.half;
  const near = k > ABOUT_TO;
  const blink = near && Math.floor(t * 20) % 2 === 0;
  // the ring closes on the spot, its front half brighter than the back
  const r = half + (1 - k) * RING.far;
  ellipseRing(x, GROUND, r, r * RING.flat, VOID[2], 0.5 + 0.5 * k, -1);
  ellipseRing(x, GROUND, r, r * RING.flat, near ? VOID[4] : VOID[3], 0.6 + 0.4 * k, 1);
  // the floor opens: a dark lens the pillar's width, a seam of light splitting along its middle
  const lens = half * (0.4 + 0.6 * k);
  polygon(
    [
      [x - lens, GROUND],
      [x - lens * 0.5, GROUND - 1],
      [x + lens * 0.5, GROUND - 1],
      [x + lens, GROUND],
      [x + lens * 0.5, GROUND + 1],
      [x - lens * 0.5, GROUND + 1],
    ],
    AC.outline,
  );
  ellipseRing(x, GROUND, lens, lens * RING.flat, VOID[3], 0.8);
  const seam = lens * k;
  hairline(x - seam, GROUND, x + seam, GROUND, blink ? WHITE : near ? VOID[5] : VOID[4]);
  // motes of light rise out of it, faster and brighter as it nears
  for (let m = 0; m < 4; m++) {
    const lift = (k * 2.6 + m * 0.29) % 1;
    fleck(x + (m - 1.5) * lens * 0.45, GROUND - 1 - lift * (6 + k * 10), VOID[4], (1 - lift) * k);
  }
  // a thread of light already marks the pillar's line, broken until it is about to strike
  hairline(x, 0, x, GROUND, VOID[3], (u) => (near || Math.sin(u * 60 - t * 24) > 0.2 ? 0.25 + 0.4 * k : 0));
  if (near) hairline(x + 0.5, 0, x + 0.5, GROUND, VOID[2], 0.5);
  // and the sky tears open over it
  const tear = SKY_TEAR.start + (SKY_TEAR.open - SKY_TEAR.start) * k;
  line(x - tear, 0, x + tear, 0, VOID[2], 0.6 + 0.4 * k);
  hairline(x - tear * 0.6, 1, x + tear * 0.6, 1, near ? VOID[5] : VOID[4], 0.7);
  glow(x, GROUND - 2, 10 + 6 * k, VOID[3], 0.2 + 0.3 * k);
  glow(x, 1, 6 + 4 * k, VOID[3], 0.2 + 0.3 * k);
}

/**
 * The pillar strike, k running from 1 as it lands to 0 as it is gone: a column from the sky to the floor, white at its
 * heart, crimson to its edges, a broken fringe flickering along each side, a flash around it on the first frames and a
 * splash of light at its foot. It thins from the edges in and breaks into streaks as it fades.
 */
function drawStrike(x: number, k: number, t: number): void {
  const flash = k > 1 - FLASH;
  const half = Math.max(1, Math.round(PILLAR.half * (0.2 + 0.8 * k ** 1.2)));
  const broken = k < 0.6;
  if (flash) line(x - half - 2, 0, x - half - 2, GROUND, VOID[4], 0.5);
  if (flash) line(x + half + 2, 0, x + half + 2, GROUND, VOID[4], 0.5);
  for (let o = -half - 1; o <= half + 1; o++) {
    const edge = Math.abs(o) / half;
    if (edge > 1) {
      // the fringe: a broken crimson edge that crawls
      line(x + o, 0, x + o, GROUND, VOID[2], (u) => (Math.sin(u * 47 + t * 31 + o * 2.3) > 0.1 ? 0.9 : 0));
      continue;
    }
    const c = Math.abs(o) <= (k > 0.5 ? 1 : 0) ? WHITE : edge < 0.45 ? VOID[5] : edge < 0.8 ? VOID[4] : VOID[3];
    // fading, the column breaks into streaks that run down it over a thin crimson veil
    if (!broken || o === 0) {
      line(x + o, 0, x + o, GROUND, c);
      continue;
    }
    line(x + o, 0, x + o, GROUND, VOID[3], 0.45);
    line(x + o, 0, x + o, GROUND, c, (u) => (Math.sin(u * 38 - t * 50 + o * 1.7) > 0.6 - k ? 1 : 0));
  }
  // the splash at its foot: tongues of light thrown out along the floor either way, and a white pool under it
  const out = SPLASH.out * (1 - k * 0.5);
  for (const side of [-1, 1]) {
    polygon(
      [
        [x + side * half, GROUND + 1],
        [x + side * (half + out), GROUND - SPLASH.up * k * 0.4],
        [x + side * (half + out * 0.5), GROUND - SPLASH.up * k],
        [x + side * (half - 1), GROUND - 2],
      ],
      VOID[4],
      0.5 + 0.5 * k,
    );
    px(x + side * (half + out), GROUND - SPLASH.up * k * 0.4 - 1, VOID[5], k);
  }
  line(x - half - 1, GROUND, x + half + 1, GROUND, WHITE, k);
  ellipseRing(x, GROUND, PILLAR.half + (1 - k) * 14, 3 + (1 - k) * 2, VOID[5], k);
  glowLine(x, 0, x, GROUND, 12 + 8 * k, VOID[3], 0.6 * k);
  glow(x, GROUND - 3, 22, VOID[5], 0.6 * k);
}

/**
 * One pillar of void light the Abyss Sovereign calls down. After `delay` a ring opens on the floor at x and tightens
 * for the warning; then the pillar strikes from the sky to the floor, once, on any hero standing in it at any height.
 */
export function createVoidPillar(x: number, delay: number, damage: number): Effect {
  let t = -delay;
  const hit = new Set<number>();
  return {
    update(dt) {
      const before = t;
      t += dt;
      if (t < PILLAR.warn) return true;
      if (before < PILLAR.warn) {
        shake(0.12, 2);
        sfx.thunder();
        for (let i = 0; i < 8; i++)
          particles.spawn(PK.SPARK, x + rng.range(-6, 6), GROUND - 1, rng.range(-80, 80), rng.range(-170, -50), 0.35, {
            sparks: VOID_SPARKS,
          });
      }
      if (t < PILLAR.warn + PILLAR.hurts)
        eachStanding(() => {
          if (hit.has(heroSlot()) || !boxHit([x - PILLAR.half, 0, x + PILLAR.half, GROUND], heroBox())) return;
          hit.add(heroSlot());
          hurtHero(damage, x);
        });
      return t < PILLAR.warn + PILLAR.fade;
    },
    draw() {
      if (t < 0) return;
      place();
      if (t < PILLAR.warn) drawWarning(x, t / PILLAR.warn, t);
      else drawStrike(x, 1 - clamp((t - PILLAR.warn) / PILLAR.fade), t);
    },
  };
}
