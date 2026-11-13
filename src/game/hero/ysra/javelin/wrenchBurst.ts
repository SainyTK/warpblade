import { EMBER } from "../../../../constants/characters/ysra/look";
import { PF, PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { lights, particles, rng } from "../../../state";

/**
 * Embers torn out where the glaive comes free at (x, y): a spray of sparks and flame up and away along `face`, and
 * glowing embers that drift down after. Light enough that she and the foe stay in view; only the look.
 */
export function wrenchBurst(x: number, y: number, face: number): void {
  lights.add(x, y, 40, EMBER[4], 0.45, 0.3);
  lights.add(x, y, 8, WHITE, 0.4, 0.08);
  for (let i = 0; i < 12; i++) {
    const a = rng.range(-2.6, -0.5);
    const sp = rng.range(120, 300);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp * face, Math.sin(a) * sp, rng.range(0.15, 0.4));
  }
  for (let i = 0; i < 9; i++)
    particles.spawn(PK.FIRE, x, y, face * rng.range(-20, 60), -rng.range(30, 90), rng.range(0.2, 0.4), {
      col: 0,
      size: rng.range(1.2, 2.4),
      flag: rng.chance(0.3) ? PF.SMOKES : 0,
    });
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.EMBER, x + rng.range(-6, 6), y - rng.range(0, 8), rng.range(-30, 30), -rng.range(40, 80), 1, {
      delay: rng.range(0.05, 0.25),
    });
}
