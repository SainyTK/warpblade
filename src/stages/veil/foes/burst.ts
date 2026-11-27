import { fxRng, particles } from "../../../game/state";
import type { Ramp } from "../../../types/color";
import { PK } from "../../../types/particle";

export function sparkBurst(x: number, y: number, n: number, sparks: Ramp, speed = 80): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.SPARK,
      x + fxRng.range(-3, 3),
      y + fxRng.range(-3, 3),
      fxRng.range(-speed, speed),
      -fxRng.range(speed * 0.2, speed * 1.2),
      fxRng.range(0.2, 0.45),
      { sparks },
    );
}

export function shardBurst(x: number, y: number, n: number, colors: Ramp): void {
  for (let i = 0; i < n; i++)
    particles.spawn(PK.SHARD, x, y, fxRng.range(-70, 70), -fxRng.range(30, 110), fxRng.range(0.35, 0.6), {
      col: fxRng.pick(colors),
      size: fxRng.range(0.8, 1.8),
    });
}
