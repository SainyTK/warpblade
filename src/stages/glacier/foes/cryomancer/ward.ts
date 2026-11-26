import { fxRng, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FOE } from "../colors";

const wards = new WeakMap<Enemy, number>();

export const wardLeft = (e: Enemy): number => wards.get(e) ?? 0;

export function raiseWard(e: Enemy, seconds: number): void {
  wards.set(e, seconds);
}

export function ageWard(e: Enemy, dt: number): void {
  const left = wardLeft(e);
  if (left > 0) wards.set(e, Math.max(0, left - dt));
}

export function breakWard(e: Enemy): void {
  wards.set(e, 0);
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.SHARD,
      e.x + e.face * 13,
      e.y - fxRng.range(4, 30),
      e.face * fxRng.range(20, 80),
      -fxRng.range(20, 90),
      0.5,
      {
        col: fxRng.pick(FOE.crystal),
        size: fxRng.range(1, 2),
      },
    );
  sfx.shatter();
}
