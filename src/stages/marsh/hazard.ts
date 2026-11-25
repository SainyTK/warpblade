import { GROUND, W } from "../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place, px } from "../../engine/frame";
import { eachStanding } from "../../game/coopHooks";
import { heroGuarded } from "../../game/hero/guard";
import { hurtHero } from "../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../game/state";
import type { Approach, StageHazard } from "../../types/campaign";
import { PK } from "../../types/particle";
import { clamp, smooth } from "../../utils/math";
import { floorSites } from "./floorSites";
import { LEECH_COLORS as C, LEECH_SPARKS } from "./foes/leechColors";

const VENT = {
  spacing: 150,
  phase: 40,
  half: 13,
  period: 5.4,
  swell: 1.1,
  pop: 0.22,
  drag: 5,
  hit: 7,
  extra: 6,
} as const;

let span = 1;
let sites: number[] = [];
let clock = 0;

const phaseOf = (i: number): number => (clock + i * 1.91) % VENT.period;
const swellStart = VENT.period - VENT.swell - VENT.pop;

function stage(i: number): { swell: number; popping: boolean; since: number } {
  const p = phaseOf(i);
  const swell = clamp((p - swellStart) / VENT.swell);
  const popping = p >= VENT.period - VENT.pop;
  return { swell, popping, since: popping ? p - (VENT.period - VENT.pop) : -1 };
}

function dome(x: number, height: number, radius: number): void {
  for (let y = 0; y <= Math.ceil(height); y++) {
    const k = y / Math.max(1, height);
    const half = radius * Math.sqrt(Math.max(0, 1 - k * k));
    const row = GROUND - y;
    for (let dx = -half; dx <= half; dx++) {
      const edge = dx > half - 1.5 || y === Math.ceil(height);
      const lit = dx < -half * 0.2 && k > 0.4;
      px(x + dx, row, edge ? C.mudDark : lit ? C.mudLight : C.mud);
    }
  }
}

function onVent(x: number): boolean {
  return hero.ground && Math.abs(hero.x - x) < VENT.half && hero.y >= GROUND - 1;
}

function popVent(x: number, since: number, dt: number): void {
  if (since >= 0 && since < dt * 1.5) {
    for (let i = 0; i < 10; i++)
      particles.spawn(
        PK.SPARK,
        x + fxRng.range(-8, 8),
        GROUND - 2,
        fxRng.range(-60, 60),
        -fxRng.range(80, 170),
        fxRng.range(0.25, 0.5),
        { sparks: LEECH_SPARKS },
      );
  }
  if (since < 0 || since > 0.12) return;
  eachStanding(() => {
    if (!onVent(x) || heroGuarded()) return;
    hurtHero(VENT.hit + VENT.extra * (x / span), x);
  });
}

export function createMarshHazard(areas: readonly Approach[]): StageHazard {
  const layout = floorSites(areas, VENT.spacing, VENT.phase);
  span = layout.span;
  return {
    reset() {
      sites = layout.xs;
      clock = 0;
    },
    update(dt) {
      if (game.mode !== "play") return;
      clock += dt;
      sites.forEach((x, i) => {
        if (Math.abs(x - hero.x) > W) return;
        const { swell, since } = stage(i);
        eachStanding(() => {
          if (onVent(x)) hero.vx -= hero.vx * VENT.drag * dt;
        });
        if (swell > 0 && fxRng.chance(dt * (2 + swell * 14)))
          particles.spawn(PK.DUST, x + fxRng.range(-8, 8), GROUND - 1, 0, -fxRng.range(4, 12), 0.5, {
            col: C.mudLight,
            size: fxRng.range(1, 2),
          });
        popVent(x, since, dt);
      });
    },
    drawBack(cameraX, t) {
      place();
      sites.forEach((x, i) => {
        if (x < cameraX - 30 || x > cameraX + W + 30) return;
        const { swell, since } = stage(i);
        const hw = VENT.half;
        for (let dx = -hw; dx <= hw; dx++) {
          const edge = Math.abs(dx) > hw - 2;
          px(x + dx, GROUND, edge ? C.mudRim : C.mud);
          px(x + dx, GROUND + 1, edge ? C.mud : C.mudDark);
        }
        hairline(x - hw * 0.6, GROUND + 0.25, x - hw * 0.15, GROUND + 0.25, C.wetSkyDim);
        const wobble = Math.sin(t * 2 + x) * 3;
        fleck(x + wobble, GROUND + 0.25, C.wetSky);
        if (swell > 0) {
          const h = smooth(0, 1, swell) * 4.5;
          const r = 4 + swell * 4;
          dome(x, h, r);
          fleck(x - 2, GROUND - h - 0.5, C.wetSky);
          const ring = (t * 1.6) % 1;
          ellipseRing(x, GROUND, 6 + ring * 10, 1.4 + ring, C.rift, 0.6 * (1 - ring) * swell);
          if (swell > 0.6) px(x, GROUND - h - 1, Math.sin(t * 30) > 0 ? C.riftHot : C.rift);
          glow(x, GROUND - 2, 10 + swell * 10, C.rift, 0.12 + swell * 0.22);
        }
        if (since >= 0) {
          const k = since / VENT.pop;
          ellipseRing(x, GROUND - 1, 8 + k * 10, 2 + k * 3, C.mudRim, 1 - k);
          ellipseRing(x, GROUND - 1, 5 + k * 6, 1.5 + k * 2, C.riftHot, 1 - k);
          glow(x, GROUND - 4, 18, C.rift, 0.4 * (1 - k));
        }
      });
    },
  };
}
