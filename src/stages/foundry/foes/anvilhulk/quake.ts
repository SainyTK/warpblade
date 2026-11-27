import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, line, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, hero, particles } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const WAVE = { travel: 0.26, linger: 0.2, feet: 6 } as const;
const M = FORGE.molten;

export interface QuakeRing {
  x: number;
  half: number;
  mark: number;
  damage: number;
}

export function createQuake(owner: Enemy, q: QuakeRing): Effect {
  let t = 0;
  let cancelled = false;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (t < q.mark) {
        if (owner.hp <= 0 || owner.state !== "wind") cancelled = true;
        return !cancelled;
      }
      const reach = q.half * clamp((t - q.mark) / WAVE.travel);
      if (t - dt < q.mark) {
        for (const side of [-1, 1]) dust(q.x + side * 8, GROUND, 6, side);
        for (let i = 0; i < 14; i++)
          particles.spawn(
            PK.SHARD,
            q.x + fxRng.range(-10, 10),
            GROUND - 1,
            fxRng.range(-80, 80),
            -fxRng.range(60, 150),
            fxRng.range(0.3, 0.6),
            {
              col: fxRng.pick(FORGE.iron),
              size: fxRng.range(1, 2),
            },
          );
      }
      eachStanding(() => {
        if (struck.has(heroSlot()) || hero.y < GROUND - WAVE.feet) return;
        if (Math.abs(hero.x - q.x) > reach + 4) return;
        struck.add(heroSlot());
        hurtHero(q.damage, q.x);
      });
      if (fxRng.chance(0.6))
        for (const side of [-1, 1])
          particles.spawn(
            PK.SPARK,
            q.x + side * reach,
            GROUND - 1,
            side * fxRng.range(10, 60),
            -fxRng.range(30, 90),
            0.3,
            {
              sparks: FORGE_SPARKS.molten,
            },
          );
      return t < q.mark + WAVE.travel + WAVE.linger;
    },
    drawBack() {
      place();
      if (t < q.mark) {
        const u = clamp(t / q.mark);
        const pulse = 0.5 + 0.5 * Math.sin(t * (10 + u * 20));
        for (const side of [-1, 1]) {
          const end = q.x + side * q.half;
          line(q.x + side * 10, GROUND, end, GROUND, u > 0.7 ? M[3] : M[1], 0.25 + u * 0.5 * pulse);
          hairline(end, GROUND - 2, end, GROUND, M[u > 0.7 ? 4 : 2], 0.4 + u * 0.6);
        }
        return;
      }
      const reach = q.half * clamp((t - q.mark) / WAVE.travel);
      const fade = 1 - clamp((t - q.mark - WAVE.travel) / WAVE.linger);
      for (const side of [-1, 1]) {
        const front = q.x + side * reach;
        hairline(q.x, GROUND - 0.5, front, GROUND - 0.5, M[2], 0.6 * fade);
        for (let k = 0; k < 4; k++) fleck(front - side * k * 1.5, GROUND - 1 - (3 - k) * 0.7, M[4], fade);
        glow(front, GROUND - 2, 10, M[2], 0.4 * fade);
      }
    },
    draw() {},
  };
}
