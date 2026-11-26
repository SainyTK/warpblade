import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, game, hero, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { SKY_FOES as C, SKY_SPARKS } from "../colors";

export const DISCHARGE = { radius: 36, grow: 0.22, life: 0.4, arcs: 9 } as const;

const heroDistance = (x: number, y: number): number => {
  const nx = clamp(x, hero.x - 5, hero.x + 5);
  const ny = clamp(y, hero.y - 32, hero.y);
  return Math.hypot(nx - x, ny - y);
};

export function createDischargeMark(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air && e.stagger <= 0;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    drawBack() {
      place();
      const u = clamp(t / windup);
      const r = DISCHARGE.radius;
      const n = 28;
      const spin = game.t * 0.6;
      for (let i = 0; i < n; i++) {
        if (i % 2 === 1 && u < 0.85) continue;
        const a = (i / n) * TAU + spin;
        const x = e.x + Math.cos(a) * r;
        const y = e.y + Math.sin(a) * r;
        fleck(x, y, u > 0.85 ? C.volt[4] : C.bell[3], 0.3 + u * 0.6);
        fleck(x + Math.cos(a) * 0.5, y + Math.sin(a) * 0.5, C.bell[2], 0.3 + u * 0.4);
      }
      glow(e.x, e.y, r * (0.3 + u * 0.5), C.bell[3], 0.06 + u * 0.12);
    },
    draw() {},
  };
}

export function createDischarge(x: number, y: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  const bends = Array.from({ length: DISCHARGE.arcs }, () => fxRng.range(-0.25, 0.25));
  for (let i = 0; i < 14; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * 150, Math.sin(a) * 150, fxRng.range(0.2, 0.35), {
      sparks: SKY_SPARKS.volt,
    });
  }
  return {
    update(dt) {
      t += dt;
      const r = DISCHARGE.radius * clamp(t / DISCHARGE.grow);
      if (t <= DISCHARGE.grow + 0.04)
        eachStanding(() => {
          if (struck.has(heroSlot()) || heroDistance(x, y) > r) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      return t < DISCHARGE.life;
    },
    draw() {
      place();
      const u = clamp(t / DISCHARGE.grow);
      const fade = 1 - clamp((t - DISCHARGE.grow) / (DISCHARGE.life - DISCHARGE.grow));
      const r = 4 + (DISCHARGE.radius - 4) * u;
      for (let i = 0; i < DISCHARGE.arcs; i++) {
        const a0 = (i / DISCHARGE.arcs) * TAU + bends[i];
        const a1 = a0 + TAU / DISCHARGE.arcs;
        const mid = (a0 + a1) / 2;
        const rm = r + (i % 2 ? 3 : -3) * fade;
        const p0x = x + Math.cos(a0) * r;
        const p0y = y + Math.sin(a0) * r;
        const pmx = x + Math.cos(mid) * rm;
        const pmy = y + Math.sin(mid) * rm;
        const p1x = x + Math.cos(a1) * r;
        const p1y = y + Math.sin(a1) * r;
        hairline(p0x, p0y, pmx, pmy, u < 1 ? C.volt[4] : C.volt[3], fade);
        hairline(pmx, pmy, p1x, p1y, C.volt[4], fade);
        hairline(p0x + 0.5, p0y + 0.5, pmx + 0.5, pmy + 0.5, C.bell[3], fade * 0.8);
        if (i % 3 === 0) hairline(x, y, pmx * 0.4 + x * 0.6, pmy * 0.4 + y * 0.6, C.volt[4], fade * (1 - u * 0.6));
      }
      ellipseRing(x, y, r, r, C.volt[2], fade * 0.6);
      glow(x, y, r + 8, C.volt[2], 0.45 * fade);
    },
  };
}
