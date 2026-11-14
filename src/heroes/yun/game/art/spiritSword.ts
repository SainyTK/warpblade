import { fleck, glow, glowLine, hairline, place } from "../../../../engine/frame";
import { WHITE } from "../../../../utils/color";
import { SPIRIT_LENGTH } from "../../constants/swords";
import { JADE } from "../../look";

/**
 * One spirit sword in world pixels: a translucent jade copy of the jian with its point at (x, y), pointing along
 * `angle`. A pale edge and ridge, a jade body, a small guard and a glow; `k` from 0 to 1 fades it.
 */
export function drawSpiritSword(x: number, y: number, angle: number, k = 1, length = SPIRIT_LENGTH): void {
  if (k <= 0) return;
  place();
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const at = (d: number, w: number): [number, number] => [x - c * (length - d) - n * w, y - n * (length - d) + c * w];
  const grip = 3;
  const a = 0.75 * k;
  hairline(...at(grip, 0.5), ...at(length - 1.2, 0.4), JADE[3], a);
  hairline(...at(grip, -0.5), ...at(length - 1.2, -0.4), JADE[2], a);
  hairline(...at(grip, 0), ...at(length, 0), (u) => (u > 0.85 ? WHITE : JADE[5]), a);
  hairline(...at(grip, -1.8), ...at(grip, 1.8), JADE[4], a);
  hairline(...at(0, 0), ...at(grip, 0), JADE[2], a);
  fleck(...at(-0.5, 0), JADE[4], a);
  fleck(x, y, WHITE, k);
  glowLine(...at(1, 0), x, y, 5, JADE[3], 0.28 * k);
}

/** a spirit sword fading into motes where it was spent */
export function drawSwordMotes(x: number, y: number, t: number): void {
  place();
  for (let i = 0; i < 4; i++) {
    const a = i * 1.7 + t * 6;
    fleck(x + Math.cos(a) * (2 + t * 14), y - t * 10 + Math.sin(a) * 2, JADE[4 + (i % 2)], 1 - t);
  }
  glow(x, y, 6, JADE[3], 0.3 * (1 - t));
}
