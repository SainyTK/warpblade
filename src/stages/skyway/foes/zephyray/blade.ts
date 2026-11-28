import { glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { RAY } from "./colors";
import { RAY_VOLLEY } from "./constants";

const BLADE = { life: 2.2, half: 3, arc: 1.1, radius: 4.5 } as const;

function puff(x: number, y: number): void {
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.MOTE, x, y, fxRng.range(-50, 50), -fxRng.range(10, 60), fxRng.range(0.2, 0.4), {
      col: RAY.blade[2],
      size: 0.7,
    });
}

export function createWindBlade(x: number, y: number, angle: number, damage: number): Effect {
  let t = 0;
  let px = x;
  let py = y;
  const vx = Math.cos(angle) * RAY_VOLLEY.speed;
  const vy = Math.sin(angle) * RAY_VOLLEY.speed;
  const struck = new Set<number>();
  let done = false;
  return {
    update(dt) {
      t += dt;
      px += vx * dt;
      py += vy * dt;
      eachStanding(() => {
        if (done || struck.has(heroSlot())) return;
        const box = [px - BLADE.half, py - BLADE.half, px + BLADE.half, py + BLADE.half] as const;
        if (!boxHit(box, heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, px - vx * 0.05);
        done = true;
        puff(px, py);
      });
      if (!done && vy > 0 && py >= surfaceBelow(px, py - 4)) {
        done = true;
        puff(px, py);
      }
      if (px < stageLeft() - 10 || px > stageRight() + 10) done = true;
      return !done && t < BLADE.life;
    },
    draw() {
      place(px, py);
      const heading = Math.atan2(vy, vx);
      const spin = Math.sin(t * 30) * 0.15;
      const r = BLADE.radius;
      let lx = 0;
      let ly = 0;
      for (let k = 0; k <= 8; k++) {
        const a = heading - BLADE.arc + (k / 8) * BLADE.arc * 2 + spin;
        const cx = Math.cos(a) * r - Math.cos(heading) * 2;
        const cy = Math.sin(a) * r - Math.sin(heading) * 2;
        if (k > 0) {
          hairline(lx, ly, cx, cy, k > 2 && k < 6 ? RAY.blade[3] : RAY.blade[2]);
          hairline(lx * 0.7, ly * 0.7, cx * 0.7, cy * 0.7, RAY.bladeEdge[3], 0.8);
        }
        lx = cx;
        ly = cy;
      }
      for (let i = 1; i <= 3; i++)
        hairline(
          -Math.cos(heading) * (2 + i * 3),
          -Math.sin(heading) * (2 + i * 3) + (i - 2) * 1.5,
          -Math.cos(heading) * (5 + i * 3),
          -Math.sin(heading) * (5 + i * 3) + (i - 2) * 1.5,
          RAY.blade[1],
          0.7 - i * 0.18,
        );
      glow(0, 0, 8, RAY.bladeEdge[2], 0.3);
      place();
    },
  };
}
