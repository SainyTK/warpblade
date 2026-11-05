import { GROUND, W } from "../../../constants/stage";
import { glow, glowLine, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, particles, rng } from "../../state";
import { heroBox } from "../../world";
import { VOID, VOID_SPARKS } from "./colors";

/** how long the beam burns, and the part of that in which it can hurt */
export const BEAM = { life: 0.32, hurts: 0.14 } as const;
const REACH = 260;

/** where a ray from (x, y) along (ux, uy) meets the floor or the edge of the stage */
function rayEnd(x: number, y: number, ux: number, uy: number): [number, number] {
  let len = REACH;
  if (uy > 0.01) len = Math.min(len, (GROUND - 1 - y) / uy);
  if (ux > 0.01) len = Math.min(len, (W + 4 - x) / ux);
  if (ux < -0.01) len = Math.min(len, (-4 - x) / ux);
  return [x + ux * len, y + uy * len];
}

function rayHitsHero(x0: number, y0: number, x1: number, y1: number): boolean {
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
 * The Abyss Eye's sight line, then its beam. While the eye winds up a dotted line follows Kael, then holds still and
 * brightens for the last moment: that line is where the beam will burn, once, along it to the floor.
 */
export function createEyeBeam(e: Enemy, damage: number): Effect {
  const hit = new Set<number>();
  let t = 0;
  return {
    update(dt) {
      if (e.hp <= 0 || e.air || e.stun > 0 || (e.state !== "wind" && e.state !== "beam")) return false;
      if (e.state !== "beam") return true;
      t += dt;
      const [x1, y1] = rayEnd(e.x, e.y, Math.cos(e.ay), Math.sin(e.ay));
      eachStanding(() => {
        if (hit.has(heroSlot()) || t > BEAM.hurts || !rayHitsHero(e.x, e.y, x1, y1)) return;
        hit.add(heroSlot());
        hurtHero(damage, e.x);
      });
      if (rng.chance(0.8))
        particles.spawn(PK.SPARK, x1, Math.min(y1, GROUND - 1), rng.range(-60, 60), rng.range(-90, -20), 0.2, {
          sparks: VOID_SPARKS,
        });
      return t < BEAM.life;
    },
    draw() {
      place();
      const ux = Math.cos(e.ay);
      const uy = Math.sin(e.ay);
      const sx = e.x + ux * 5;
      const sy = e.y + uy * 5;
      const [x1, y1] = rayEnd(e.x, e.y, ux, uy);
      if (e.state === "wind") {
        // the sight line: sparse dots that crawl outward while it tracks, a steady brighter line once it locks
        const locked = e.n === 1;
        const len = Math.hypot(x1 - sx, y1 - sy);
        const crawl = game.t * 40;
        for (let d = 0; d < len; d += 1) {
          const k = locked ? 1 : 0.75 - 0.45 * (d / len);
          if (!locked && Math.floor(d + crawl) % 8 > 4) continue;
          px(sx + ux * d, sy + uy * d, locked ? VOID[4] : VOID[3], k);
        }
        if (locked) glowLine(sx, sy, x1, y1, 4, VOID[3], 0.2);
        return;
      }
      const k = 1 - clamp(t / BEAM.life);
      const wide = k > 0.5 ? 2 : 1;
      const nx = -uy;
      const ny = ux;
      for (let o = -wide; o <= wide; o++) {
        const c = o === 0 ? VOID[5] : Math.abs(o) === 1 ? VOID[4] : VOID[3];
        line(sx + nx * o, sy + ny * o, x1 + nx * o, y1 + ny * o, c, o === 0 ? 1 : 0.85 * k + 0.15);
      }
      glowLine(sx, sy, x1, y1, 6 + 4 * k, VOID[3], 0.5 * k);
      glow(x1, Math.min(y1, GROUND - 1), 14, VOID[4], 0.6 * k);
      glow(sx, sy, 10, VOID[5], 0.6 * k);
    },
  };
}
