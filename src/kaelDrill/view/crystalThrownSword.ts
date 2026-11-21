import { HERO_COLORS as HC } from "../../constants/palette";
import { fleck, glow, glowLine, hairline, line } from "../../engine/frame";
import { skin } from "../../game/hero/skin";
import { WHITE } from "../../utils/color";

const BLADE = { length: 19, grip: 3.6, guard: 3 } as const;
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
  line(...at(BLADE.grip + 0.5, 0.6), ...at(BLADE.length - 3, 0.5), HC.blade);
  hairline(...at(BLADE.grip, 1), ...at(BLADE.length - 1.5, 0.6), HC.bladeBack);
  hairline(...at(BLADE.grip, -0.5), ...at(BLADE.length, -0.25), (u) => (u > 0.8 ? WHITE : HC.bladeEdge));
  hairline(...at(0, 0), neckX, neckY, HC.hilt);
  hairline(...at(BLADE.grip - 1.4, -BLADE.guard), ...at(BLADE.grip, 0), HC.trim);
  hairline(...at(BLADE.grip - 1.4, BLADE.guard), ...at(BLADE.grip, 0), HC.trim);
  fleck(...at(BLADE.grip - 0.6, 0), HC.bladeEdge);
  fleck(...at(0, 0), HC.trimLight);
  fleck(tipX, tipY, WHITE);
  glowLine(...at(1, 0), x, y, 6, skin.ramp[3], 0.45);
  glow(...at(BLADE.grip - 0.6, 0), 4, skin.ramp[4], 0.35);
  glow(x, y, 8, WHITE, 0.2);
}
