import { glow, place, sparkle } from "../../../../../engine/frame";
import type { Effect } from "../../../../../types/effect";
import { PK } from "../../../../../types/particle";
import { bladeAngle } from "../../../../../utils/poseFrame";
import { hero, particles, rng } from "../../../../state";
import { skin } from "../../../skin";

/**
 * The heft's glowing tip: while J is held the glaive's point heats up her ramp, the glow widening with the charge,
 * embers drawn into it, and a white glint once the wind is full. `charge` reads the part of a full wind, 0 to 1.
 */
export function createHeftGlow(charge: () => number): Effect {
  let t = 0;
  const tip = (): [number, number] => {
    const a = bladeAngle(hero.pose);
    const [hx, hy] = hero.hand;
    const L = skin.reach - 1;
    return [hx + Math.cos(a) * L, hy + Math.sin(a) * L];
  };
  return {
    update(dt) {
      t += dt;
      if (hero.state !== "heft") return false;
      const k = charge();
      if (rng.chance(0.25 + k * 0.5)) {
        const [x, y] = tip();
        const a = rng.range(0, Math.PI * 2);
        const d = rng.range(6, 12);
        const wx = hero.x + hero.face * (x + Math.cos(a) * d);
        const wy = hero.y + y + Math.sin(a) * d;
        particles.spawn(PK.EMBER, wx, wy, -Math.cos(a) * d * 5 * hero.face, -Math.sin(a) * d * 5, 0.2, {
          col: skin.ramp[rng.int(3, 5)],
          size: 1,
        });
      }
      return true;
    },
    draw() {
      const k = charge();
      const [x, y] = tip();
      place(hero.x, hero.y, hero.face < 0);
      const R = skin.ramp;
      glow(x, y, 5 + k * 9, R[3], 0.25 + k * 0.45);
      glow(x, y, 3 + k * 3, R[5], 0.3 + k * 0.4);
      if (k >= 1) sparkle(x, y, 2 + Math.abs(Math.sin(t * 14)) * 2, R[5], R[3], 0.5);
    },
  };
}
