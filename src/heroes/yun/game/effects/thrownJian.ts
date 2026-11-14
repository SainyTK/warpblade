import { HERO_COLORS as HC } from "../../../../constants/palette";
import { fleck, glow, glowLine, hairline } from "../../../../engine/frame";
import { WHITE } from "../../../../utils/color";
import { JADE } from "../../look";

/** the flying jian: its length from pommel to point, where the blade starts, the guard's half width, the tassel */
const BLADE = { length: 18, grip: 3.5, guard: 2.2, tassel: 9 } as const;

/**
 * Yun's jian in the warp, point first at (x, y): the blade with its ridge, the guard and its jade crystal, the tassel
 * streaming out behind with a wave in it, and a jade wisp of Yun riding the flat of the blade
 */
export function drawThrownJian(x: number, y: number, angle: number, t: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const at = (d: number, w: number): [number, number] => [
    x - c * (BLADE.length - d) - n * w,
    y - n * (BLADE.length - d) + c * w,
  ];
  const [tipX, tipY] = at(BLADE.length, 0);
  hairline(...at(BLADE.grip, 0.5), ...at(BLADE.length - 1.5, 0.5), HC.bladeBack);
  hairline(...at(BLADE.grip, -0.5), ...at(BLADE.length - 1.5, -0.5), HC.blade);
  hairline(...at(BLADE.grip, 0), ...at(BLADE.length, 0), (u) => (u > 0.8 ? WHITE : HC.bladeEdge));
  hairline(...at(0, 0), ...at(BLADE.grip, 0), HC.hilt);
  hairline(...at(BLADE.grip, -BLADE.guard), ...at(BLADE.grip, BLADE.guard), HC.trim);
  fleck(...at(BLADE.grip, 0), HC.scarfLight);
  fleck(...at(-0.5, 0), HC.trimLight);
  for (let i = 1; i <= BLADE.tassel; i++) {
    const wave = Math.sin(t * 30 - i * 0.9) * i * 0.18;
    const [px, py] = at(-0.5 - i, wave);
    fleck(px, py, i < 3 ? HC.trim : i % 2 ? HC.scarf : HC.scarfLight, 1 - i / (BLADE.tassel + 3));
  }
  drawRider(at, t);
  fleck(tipX, tipY, WHITE);
  glowLine(...at(1, 0), x, y, 6, JADE[3], 0.45);
  glow(x, y, 8, WHITE, 0.2);
}

/** the wisp of Yun standing on the blade: a jade figure from the flat of the blade up, the robe streaming back */
function drawRider(at: (d: number, w: number) => [number, number], t: number): void {
  const [fx, fy] = at(8, 0);
  const sway = Math.sin(t * 18) * 0.4;
  const a = 0.55;
  hairline(fx, fy - 1, fx + sway, fy - 9, JADE[4], a);
  hairline(fx + 1, fy - 1, fx + 1 + sway, fy - 8, JADE[3], a);
  hairline(fx + sway, fy - 9, fx + sway - 6, fy - 6, JADE[3], (u) => a * (1 - u));
  fleck(fx + sway, fy - 11, JADE[5], a + 0.2);
  fleck(fx + sway + 1, fy - 11, JADE[4], a);
  glow(fx, fy - 6, 7, JADE[3], 0.25);
}
