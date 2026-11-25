import { GROUND, W } from "../../constants/stage";
import { fleck, glow, glowLine, hairline, line, place, sparkle } from "../../engine/frame";
import { eachStanding } from "../../game/coopHooks";
import { heroGuarded } from "../../game/hero/guard";
import { hurtHero } from "../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../game/state";
import { boxHit, heroBox } from "../../game/world";
import type { Approach, StageHazard } from "../../types/campaign";
import { PK } from "../../types/particle";
import { clamp } from "../../utils/math";
import { floorSites } from "../marsh/floorSites";
import { KNIGHT_COLORS as C, SHARD_SPARKS } from "./foes/knightColors";

const TEAR = { spacing: 190, phase: 110, half: 6, height: 30, period: 3.4, charge: 0.85, zap: 0.28 } as const;
const HIT = { base: 9, extra: 7 } as const;

let span = 1;
let tears: number[] = [];
let clock = 0;

const chargeStart = TEAR.period - TEAR.charge - TEAR.zap;

function cycle(i: number): { charge: number; zap: number } {
  const p = (clock + i * 1.37) % TEAR.period;
  const charge = clamp((p - chargeStart) / TEAR.charge);
  const zap = p >= TEAR.period - TEAR.zap ? (p - (TEAR.period - TEAR.zap)) / TEAR.zap : -1;
  return { charge, zap };
}

function zapHero(x: number): void {
  eachStanding(() => {
    const zone = [x - TEAR.half, GROUND - TEAR.height, x + TEAR.half, GROUND] as const;
    if (!boxHit(zone, heroBox()) || heroGuarded()) return;
    hurtHero(HIT.base + HIT.extra * (x / span), x);
  });
}

function seam(x: number, t: number, wide: number, color: number, a: number): void {
  for (let y = 0; y < TEAR.height; y += 3) {
    const k = y / TEAR.height;
    const bulge = Math.sin(k * Math.PI) * wide;
    const jag = Math.sin(t * 9 + y * 1.3 + x) * 0.8;
    const y0 = GROUND - 1 - y;
    hairline(x - bulge + jag, y0, x - bulge * 0.8 - jag, y0 - 3, color, a);
    hairline(x + bulge - jag, y0, x + bulge * 0.8 + jag, y0 - 3, color, a);
  }
}

export function createVeilHazard(areas: readonly Approach[]): StageHazard {
  const layout = floorSites(areas, TEAR.spacing, TEAR.phase);
  span = layout.span;
  return {
    reset() {
      tears = layout.xs;
      clock = 0;
    },
    update(dt) {
      if (game.mode !== "play") return;
      clock += dt;
      tears.forEach((x, i) => {
        if (Math.abs(x - hero.x) > W) return;
        const { charge, zap } = cycle(i);
        if (charge > 0 && zap < 0 && fxRng.chance(dt * charge * 30))
          particles.spawn(PK.SPARK, x + fxRng.range(-3, 3), GROUND - fxRng.range(2, TEAR.height), 0, 0, 0.15, {
            sparks: SHARD_SPARKS,
          });
        if (zap >= 0 && zap < 0.6) zapHero(x);
      });
    },
    drawBack(cameraX, t) {
      place();
      tears.forEach((x, i) => {
        if (x < cameraX - 30 || x > cameraX + W + 30) return;
        const { charge, zap } = cycle(i);
        const breath = 0.5 + 0.5 * Math.sin(t * 2.5 + i);
        const open = 1.4 + breath * 0.6 + charge * 2.2 + (zap >= 0 ? 2 * (1 - zap) : 0);
        for (let y = 0; y < TEAR.height; y++) {
          const k = y / TEAR.height;
          const w = Math.sin(k * Math.PI) * open;
          const jag = Math.sin(t * 6 + y * 0.9 + x) * 0.4;
          const yy = GROUND - 1 - y;
          line(x - w + jag, yy, x + w + jag, yy, C.steelDeep);
          if (w > 1) hairline(x - w + jag, yy, x - w + jag + 0.5, yy, C.crystalDark);
          hairline(x + jag - 0.25, yy, x + jag + 0.25, yy, charge > 0.5 || zap >= 0 ? C.crystalHot : C.crystal);
        }
        seam(x, t, open + 1.5, C.crystalDark, 0.6 + charge * 0.4);
        glowLine(x, GROUND - 2, x, GROUND - TEAR.height, 6 + charge * 8, C.crystal, 0.12 + charge * 0.3);
        if (charge > 0 && zap < 0) {
          const r = 10 - charge * 7;
          for (let k = 0; k < 4; k++) {
            const a = k * 1.57 + t * 3;
            fleck(x + Math.cos(a) * r, GROUND - 15 + Math.sin(a) * r * 1.6, C.crystalLight);
          }
        }
        if (zap >= 0) {
          const fade = 1 - zap;
          for (let k = 0; k < 3; k++) {
            const y0 = GROUND - 4 - k * 9;
            const side = k % 2 ? 1 : -1;
            hairline(x, y0, x + side * (5 + fxRng.range(0, 4)), y0 - 3, C.crystalHot, fade);
            hairline(x + side * 5, y0 - 3, x + side * (8 + fxRng.range(0, 3)), y0 + 1, C.crystalLight, fade);
          }
          sparkle(x, GROUND - 15, 6 + zap * 6, C.crystal, C.crystalHot, fade);
          glow(x, GROUND - 15, 24, C.crystal, 0.5 * fade);
        }
      });
    },
  };
}
