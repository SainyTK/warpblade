import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place, px } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FORGE, FORGE_SPARKS } from "../../colors";

const WAVE = { speed: 165, height: 9, half: 5, life: 1.5 } as const;

export function createShockwave(x: number, dir: number, damage: number): Effect {
  let t = 0;
  let front = x;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      front += dir * WAVE.speed * dt;
      if (front < stageLeft() + 2 || front > stageRight() - 2) return false;
      const h = WAVE.height * clamp(t / 0.08) * clamp((WAVE.life - t) / 0.3);
      eachStanding(() => {
        if (struck.has(heroSlot()) || !boxHit([front - WAVE.half, GROUND - h, front + WAVE.half, GROUND], heroBox()))
          return;
        struck.add(heroSlot());
        hurtHero(damage, front - dir * 8);
      });
      if (fxRng.chance(0.6))
        particles.spawn(
          PK.SPARK,
          front,
          GROUND - 1,
          -dir * fxRng.range(10, 50),
          -fxRng.range(40, 110),
          fxRng.range(0.2, 0.4),
          {
            sparks: FORGE_SPARKS.molten,
          },
        );
      if (fxRng.chance(0.3))
        particles.spawn(PK.SHARD, front, GROUND - 1, dir * fxRng.range(10, 40), -fxRng.range(40, 90), 0.4, {
          col: fxRng.pick(FORGE.iron),
          size: 1.4,
        });
      return t < WAVE.life;
    },
    draw() {
      place();
      const h = WAVE.height * clamp(t / 0.08) * clamp((WAVE.life - t) / 0.3);
      for (let i = 0; i < 12; i++) {
        const back = i * 2;
        const bx = front - dir * back;
        const k = 1 - i / 12;
        const hh = h * k * (0.6 + 0.4 * Math.sin(i * 1.7 + t * 30));
        const c = i < 2 ? FORGE.molten[5] : i < 5 ? FORGE.molten[4] : i < 8 ? FORGE.molten[3] : FORGE.molten[2];
        hairline(bx, GROUND, bx, GROUND - hh, c);
        hairline(bx - dir * 0.5, GROUND, bx - dir * 0.5, GROUND - hh * 0.7, FORGE.molten[2]);
      }
      px(front, GROUND - h, FORGE.molten[4]);
      fleck(front + dir, GROUND - h - 1, FORGE.molten[5]);
      hairline(front - dir * 30, GROUND + 0.5, front, GROUND + 0.5, FORGE.molten[1], 0.8);
      glow(front - dir * 6, GROUND - 4, 14, FORGE.molten[2], 0.4);
    },
  };
}

export function createSlamMark(owner: Enemy, reach: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return owner.hp > 0 && owner.state === "charge";
    },
    draw() {
      place();
      const x = owner.x + owner.face * reach;
      const k = clamp(t / 0.6);
      ellipseRing(x, GROUND, 6 + k * 4, 1.6, FORGE.molten[2], 0.35 + k * 0.5);
      hairline(x - 3, GROUND, x + 3, GROUND, k > 0.7 ? FORGE.molten[5] : FORGE.molten[3], 0.6 + k * 0.4);
      for (const side of [-1, 1]) {
        const run = ((t * 3) % 1) * 18;
        for (let i = 0; i < 3; i++) {
          const ax = x + side * (10 + run + i * 6);
          fleck(ax, GROUND - 1, FORGE.molten[3], k * (1 - i * 0.3));
          fleck(ax - side, GROUND - 2, FORGE.molten[2], k * (1 - i * 0.3));
        }
      }
      glow(x, GROUND - 2, 10 + k * 6, FORGE.molten[2], 0.15 + k * 0.3);
    },
  };
}
