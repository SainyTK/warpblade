import { GROUND } from "../../../../constants/stage";
import { fleck, glow, place, polygon, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

export const BREATH = { length: 88, step: 8, slices: 12 } as const;

export interface BreathSpec {
  x: number;
  y: number;
  dir: number;
  warm: number;
  burn: number;
  damage: number;
}

const centerAt = (b: BreathSpec, d: number): number => b.y + (GROUND - 7 - b.y) * (d / BREATH.length) ** 0.85;
const halfAt = (d: number): number => 1.5 + d * 0.15;

function outline(b: BreathSpec, reach: number, widen: number): [number, number][] {
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let i = 0; i <= BREATH.slices; i++) {
    const d = (i / BREATH.slices) * reach;
    const cy = centerAt(b, d);
    const h = halfAt(d) * widen;
    top.push([b.x + b.dir * d, cy - h]);
    bottom.push([b.x + b.dir * d, Math.min(GROUND, cy + h)]);
  }
  return [...top, ...bottom.reverse()];
}

function warning(b: BreathSpec, k: number, t: number): void {
  for (let d = 6; d < BREATH.length; d += 5) {
    if (Math.sin(t * 24 - d * 0.4) < 0.2) continue;
    const cy = centerAt(b, d);
    const h = halfAt(d);
    fleck(b.x + b.dir * d, cy - h, FORGE.molten[3], k * 0.8);
    fleck(b.x + b.dir * d, Math.min(GROUND - 0.5, cy + h), FORGE.molten[3], k * 0.8);
  }
  for (let i = 0; i < 6; i++) {
    const u = (t * 2 + i / 6) % 1;
    const a = i * 1.1;
    fleck(b.x + Math.cos(a) * 10 * (1 - u), b.y + Math.sin(a) * 8 * (1 - u), FORGE.molten[4], k);
  }
  glow(b.x, b.y, 8 + k * 8, FORGE.molten[2], 0.2 + k * 0.4);
}

function flame(b: BreathSpec, age: number): void {
  const grow = clamp(age / 0.12);
  const fade = clamp((b.burn - age) / 0.2);
  const reach = BREATH.length * grow;
  const flicker = 0.9 + Math.sin(age * 50) * 0.08;
  polygon(outline(b, reach, flicker), FORGE.molten[2], 0.85 * fade);
  polygon(outline(b, reach * 0.88, 0.62 * flicker), FORGE.molten[3], fade);
  polygon(outline(b, reach * 0.6, 0.32), FORGE.molten[4], fade);
  polygon(outline(b, reach * 0.3, 0.2), FORGE.molten[5], fade);
  for (let i = 0; i < 10; i++) {
    const d = (age * 160 + i * 23) % reach || 1;
    const cy = centerAt(b, d) + Math.sin(i * 3.1 + age * 20) * halfAt(d) * 0.7;
    px(b.x + b.dir * d, cy, i % 3 ? FORGE.molten[4] : FORGE.molten[5], fade);
  }
  for (let d = 10; d < reach; d += 22) glow(b.x + b.dir * d, centerAt(b, d), 14, FORGE.molten[2], 0.3 * fade);
}

export function createBreath(owner: Enemy, b: BreathSpec): Effect {
  let t = 0;
  let age = 0;
  const struck = new Set<number>();
  return {
    update(dt) {
      if (owner.hp <= 0) return false;
      if (owner.state === "wind" && age === 0) {
        t += dt;
        return true;
      }
      if (owner.state !== "beam") return false;
      age += dt;
      for (let d = 4; d < BREATH.length * clamp(age / 0.12); d += BREATH.step) {
        const x = b.x + b.dir * d;
        const cy = centerAt(b, d);
        const h = halfAt(d);
        eachStanding(() => {
          if (struck.has(heroSlot()) || !boxHit([x - 4, cy - h, x + 4, cy + h], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(b.damage, b.x);
        });
      }
      if (fxRng.chance(0.8)) {
        const d = fxRng.range(10, BREATH.length);
        particles.spawn(
          PK.FIRE,
          b.x + b.dir * d,
          centerAt(b, d),
          b.dir * fxRng.range(20, 60),
          -fxRng.range(10, 30),
          0.35,
          {
            size: fxRng.range(1.5, 3),
          },
        );
      }
      if (fxRng.chance(0.5))
        particles.spawn(PK.SPARK, b.x + b.dir * 10, b.y, b.dir * fxRng.range(80, 180), fxRng.range(-20, 60), 0.4, {
          sparks: FORGE_SPARKS.molten,
        });
      return age < b.burn;
    },
    draw() {
      place();
      if (age === 0) warning(b, clamp(t / b.warm), t);
      else flame(b, age);
    },
  };
}
