import { fleck, glow, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { PHOSPHOR } from "../../constants/colors";

const LIFE = 0.08;
/** the flash's length along the shot and its spread across it */
const SIZE = { long: 9, wide: 3.5 } as const;

/** the flash at the muzzle as a round leaves it: a white spike along the shot in a green flare, gone in a few frames */
export function createMuzzleFlash(x: number, y: number, angle: number): Effect {
  let t = 0;
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const k = 1 - t / LIFE;
      const long = SIZE.long * (0.6 + 0.4 * k);
      for (let d = 0; d <= long; d += 0.5) {
        const spread = SIZE.wide * (1 - d / long) * k;
        for (let w = -spread; w <= spread; w += 0.5) {
          const c = Math.abs(w) < spread * 0.35 ? WHITE : Math.abs(w) < spread * 0.7 ? PHOSPHOR[5] : PHOSPHOR[4];
          fleck(x + ca * d - sn * w, y + sn * d + ca * w, c, k + 0.2);
        }
      }
      glow(x + ca * 3, y + sn * 3, 12, PHOSPHOR[4], 0.6 * k);
    },
  };
}
