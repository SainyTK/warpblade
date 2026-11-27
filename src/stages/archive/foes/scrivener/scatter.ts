import { fxRng, particles } from "../../../../game/state";
import { PK } from "../../../../types/particle";
import { FOE } from "../colors";

export function scatterPages(x: number, y: number): void {
  for (let i = 0; i < 14; i++)
    particles.spawn(
      PK.FLAKE,
      x + fxRng.range(-6, 6),
      y + fxRng.range(-12, 12),
      fxRng.range(-60, 60),
      -fxRng.range(10, 70),
      fxRng.range(0.5, 0.9),
      {
        col: i % 3 ? FOE.paper[3] : FOE.ink[3],
        size: fxRng.range(1, 1.6),
      },
    );
}
