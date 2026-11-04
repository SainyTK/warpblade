import { EMBER } from "../../constants/characters/ysra/look";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { game, lights, particles, rng } from "../state";
import { dust } from "../world";
import { createBlastCore } from "./flash";
import { createFloorRing } from "./floorRing";

/** a burst of Ysra's forge-fire at (x, y), sized by its radius: an ember core, rolling flame, sparks and a floor ring.
 *  Only the look: whoever calls it deals the damage. */
export function emberBurst(x: number, y: number, radius: number, floor: number | null = y): void {
  const k = radius / 30;
  lights.add(x, y - 4, 70 * k, EMBER[4], 1, 0.5);
  lights.add(x, y - 4, 22, WHITE, 0.9, 0.1);
  for (let i = 0; i < 22 * k; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(30, 130) * k;
    particles.spawn(PK.FIRE, x, y - 3, Math.cos(a) * sp, Math.sin(a) * sp * 0.7 - 30, rng.range(0.3, 0.6), {
      col: 0,
      size: rng.range(1.8, 3.2),
      flag: rng.chance(0.5) ? PF.SMOKES : 0,
    });
  }
  for (let i = 0; i < 12 * k; i++) {
    const a = rng.range(Math.PI * 1.05, Math.PI * 1.95);
    const sp = rng.range(140, 340);
    particles.spawn(PK.SPARK, x, y - 3, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.55));
  }
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.EMBER, x + rng.range(-8, 8), y - rng.range(2, 12), rng.range(-30, 30), -rng.range(30, 70), 1.2, {
      delay: rng.range(0.05, 0.3),
    });
  game.fx.push(createBlastCore(x, y - 3, EMBER[4]));
  if (floor === null) return;
  dust(x, floor, 6);
  game.fx.push(createFloorRing(x, floor, radius * 1.2, EMBER, 0.45));
}
