import { ellipseRing, fleck, glow, hairline, place, polygon } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";

const SPIKE = { rise: 0.07, stand: 0.3, sink: 0.25, height: 28, half: 5 } as const;
const C = FOE.crystal;

function drawSpike(x: number, y: number, h: number): void {
  place(x, y);
  const w = SPIKE.half;
  polygon(
    [
      [-w, 0],
      [-w * 0.5, -h * 0.55],
      [0.5, -h],
      [w * 0.6, -h * 0.5],
      [w, 0],
    ],
    C[1],
  );
  polygon(
    [
      [0.5, 0],
      [0.5, -h],
      [w * 0.6, -h * 0.5],
      [w, 0],
    ],
    C[3],
  );
  hairline(-w, 0, -w * 0.5, -h * 0.55, FOE.outline);
  hairline(-w * 0.5, -h * 0.55, 0.5, -h, FOE.outline);
  hairline(0.5, -h, w * 0.6, -h * 0.5, C[4]);
  hairline(0.6, -h + 2, 0.6, -2, C[4]);
  polygon(
    [
      [-w - 3, 0],
      [-w - 2, -h * 0.35],
      [-w + 1, 0],
    ],
    C[2],
  );
  polygon(
    [
      [w - 1, 0],
      [w + 2.5, -h * 0.3],
      [w + 3, 0],
    ],
    C[2],
  );
  fleck(0.5, -h, FOE.eyeHot);
  glow(0, -h * 0.5, 14, C[2], 0.3);
  place();
}

export function createIceSpike(x: number, y: number, mark: number, damage: number): Effect {
  let t = 0;
  let burst = false;
  const struck = new Set<number>();
  const height = (): number => {
    const u = t - mark;
    if (u < 0) return 0;
    if (u < SPIKE.rise) return SPIKE.height * (u / SPIKE.rise);
    if (u < SPIKE.rise + SPIKE.stand) return SPIKE.height;
    return SPIKE.height * Math.max(0, 1 - (u - SPIKE.rise - SPIKE.stand) / SPIKE.sink);
  };
  return {
    update(dt) {
      t += dt;
      if (t < mark) {
        if (fxRng.chance(dt * 20))
          particles.spawn(PK.FLAKE, x + fxRng.range(-7, 7), y - 1, 0, -fxRng.range(10, 30), 0.5, { col: C[3] });
        return true;
      }
      if (!burst) {
        burst = true;
        shake(0.08, 1.2);
        sfx.shatter();
        for (let i = 0; i < 8; i++)
          particles.spawn(PK.SHARD, x, y - 2, fxRng.range(-70, 70), -fxRng.range(60, 150), fxRng.range(0.3, 0.6), {
            col: fxRng.pick(C),
            size: fxRng.range(1, 2),
          });
      }
      const h = height();
      eachStanding(() => {
        if (struck.has(heroSlot()) || t - mark > SPIKE.rise + SPIKE.stand) return;
        if (!boxHit([x - SPIKE.half, y - h, x + SPIKE.half, y], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      return t < mark + SPIKE.rise + SPIKE.stand + SPIKE.sink;
    },
    drawBack() {
      if (t >= mark + SPIKE.rise) return;
      const u = clamp(t / mark);
      place(x, y);
      const r = 12 - u * 4;
      ellipseRing(0, 0, r, r * 0.28, C[u > 0.75 ? 4 : 2], 0.55 + u * 0.45);
      ellipseRing(0, 0, r * 0.55, r * 0.16, C[3], u);
      hairline(-SPIKE.half * u, 0.25, SPIKE.half * u, 0.25, C[4], 0.9);
      glow(0, -2, 14, C[2], 0.12 + u * 0.3);
      place();
    },
    draw() {
      const h = height();
      if (h >= 1) drawSpike(x, y, h);
    },
  };
}
