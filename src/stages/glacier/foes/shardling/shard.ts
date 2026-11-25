import { fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { FOE } from "../colors";

const SHARD = { speed: 135, life: 2.4, half: 2.5 } as const;

function burst(x: number, y: number): void {
  for (let i = 0; i < 5; i++)
    particles.spawn(PK.SHARD, x, y, fxRng.range(-50, 50), -fxRng.range(20, 80), fxRng.range(0.25, 0.45), {
      col: fxRng.pick(FOE.crystal),
      size: fxRng.range(0.8, 1.6),
    });
}

export function createIceShard(
  x: number,
  y: number,
  angle: number,
  damage: number,
  speed: number = SHARD.speed,
): Effect {
  let t = 0;
  let px = x;
  let py = y;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const struck = new Set<number>();
  let done = false;
  return {
    update(dt) {
      t += dt;
      px += vx * dt;
      py += vy * dt;
      eachStanding(() => {
        if (done || struck.has(heroSlot())) return;
        const box = [px - SHARD.half, py - SHARD.half, px + SHARD.half, py + SHARD.half] as const;
        if (!boxHit(box, heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, px - vx * 0.05);
        done = true;
        burst(px, py);
      });
      if (!done && vy > 0 && py >= surfaceBelow(px, py - 4)) {
        done = true;
        burst(px, py);
      }
      if (px < stageLeft() - 10 || px > stageRight() + 10) done = true;
      return !done && t < SHARD.life;
    },
    draw() {
      place(px, py);
      const ux = vx / Math.hypot(vx, vy);
      const uy = vy / Math.hypot(vx, vy);
      const nx = -uy;
      const ny = ux;
      glow(0, 0, 7, FOE.crystal[2], 0.35);
      polygon(
        [
          [ux * 4, uy * 4],
          [nx * 1.3, ny * 1.3],
          [-ux * 4, -uy * 4],
          [-nx * 1.3, -ny * 1.3],
        ],
        FOE.crystal[2],
      );
      hairline(-ux * 3, -uy * 3, ux * 3.5, uy * 3.5, FOE.crystal[4]);
      for (let i = 1; i <= 3; i++) fleck(-ux * (4 + i * 3), -uy * (4 + i * 3), FOE.crystal[3], 0.8 - i * 0.22);
      place();
    },
  };
}
