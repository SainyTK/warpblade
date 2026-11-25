import { fleck, glow, shade } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { FOE } from "../foes/colors";

const SHAPE = { back: 26, front: 5 } as const;

export function drawTide(height: number, roll: number, alpha: number): void {
  if (height < 0.5 || alpha <= 0) return;
  shade(-SHAPE.back, -height - 4, SHAPE.front + 2, 1, (x, y, out) => {
    const rise = x > 0 ? Math.max(0, 1 - x / SHAPE.front) ** 0.5 : Math.max(0, 1 + x / SHAPE.back) ** 1.3;
    const lip = x > -6 && x < 3 ? Math.sin(roll * 0.4 + y * 0.9) * 0.9 : 0;
    const top = -height * rise - lip;
    if (y < top || y > 0.5) return;
    const curl = x > -4 && x < SHAPE.front && y < top + height * 0.35;
    const depth = clamp((y - top) / Math.max(1, height));
    let c = mix(FOE.ink[3], FOE.ink[0], depth);
    if (y - top < 0.9) c = FOE.inkSheen;
    if (curl && y - top < 2) c = FOE.inkGlint;
    if (Math.abs(y - top - 3 - Math.sin(x * 0.5 + roll * 0.2) * 1.5) < 0.35 && x < -2) c = mix(c, FOE.letter, 0.6);
    out.c = c;
    out.a = alpha;
  });
  for (let i = 0; i < 6; i++) {
    const t = (roll * 0.05 + i * 0.37) % 1;
    const lx = -4 - t * SHAPE.back * 0.8;
    const ly = -height * (0.85 - t * 0.6) - Math.sin(t * Math.PI) * 4;
    fleck(lx, ly, FOE.letterHot, alpha * (1 - t));
    fleck(lx + 0.5, ly + 0.5, FOE.letter, alpha * (1 - t));
  }
  for (let i = 0; i < 4; i++) {
    const a = roll * 0.3 + i * 1.7;
    fleck(SHAPE.front - 1 + Math.cos(a) * 2, -height - 1 + Math.sin(a) * 2, FOE.inkGlint, alpha);
  }
  glow(-4, -height * 0.5, height + 8, FOE.inkSheen, 0.32 * alpha);
  glow(-2, -height * 0.4, 8, FOE.letter, 0.2 * alpha);
}
