import { HERO_COLORS as HC } from "../../../../constants/palette";
import { fleck, glow, glowLine, hairline, line } from "../../../../engine/frame";
import { skin } from "../../../../game/hero/skin";
import { WHITE } from "../../../../utils/color";

/** Kael's flying sword: its length from pommel to point, where the blade starts and how far the guard reaches */
const BLADE = { length: 16, grip: 3.5, guard: 2.2 } as const;

/** Kael's crystal sword flying point first, its point at (x, y) */
export function drawThrownSword(x: number, y: number, angle: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const at = (d: number, w: number): [number, number] => [
    x - c * (BLADE.length - d) - n * w,
    y - n * (BLADE.length - d) + c * w,
  ];
  const [tipX, tipY] = at(BLADE.length, 0);
  const [neckX, neckY] = at(BLADE.grip, 0);
  line(neckX, neckY, tipX, tipY, HC.blade);
  hairline(...at(BLADE.grip, 0.5), ...at(BLADE.length - 1.5, 0.5), HC.bladeBack);
  hairline(...at(BLADE.grip, -0.25), ...at(BLADE.length, -0.25), (u) => (u > 0.8 ? WHITE : HC.bladeEdge));
  hairline(...at(0, 0), neckX, neckY, HC.hilt);
  hairline(...at(BLADE.grip, -BLADE.guard), ...at(BLADE.grip, BLADE.guard), HC.trim);
  fleck(...at(0, 0), HC.trimLight);
  fleck(tipX, tipY, WHITE);
  glowLine(...at(1, 0), x, y, 6, skin.ramp[3], 0.45);
  glow(x, y, 8, WHITE, 0.2);
}
