import { FX_BUDGET } from "../../../../constants/skillFx";
import { fleck, glow, hairline, line } from "../../../../engine/frame";
import { progress as run } from "../../../../game/state";
import type { Color, Ramp } from "../../../../types/color";
import type { ElementKit, FxCast } from "../../../../types/skillFx";
import { WHITE } from "../../../../utils/color";
import { ease, smooth, TAU } from "../../../../utils/math";
import type { FxPoint } from "../../types/skillFx";

const ARC_STEPS = 6;
const SATELLITES = 4;

function blade(x: number, y: number, angle: number, length: number, R: Ramp, dark: Color, alpha: number): void {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const x0 = x - dx * length * 0.5;
  const y0 = y - dy * length * 0.5;
  const x1 = x + dx * length * 0.5;
  const y1 = y + dy * length * 0.5;
  line(x0, y0, x1, y1, dark, alpha);
  hairline(x0 - dy * 0.5, y0 + dx * 0.5, x1 - dy * 0.5, y1 + dx * 0.5, R[4], alpha);
  fleck(x1, y1, WHITE, alpha);
  const gx = x0 + dx * 2.5;
  const gy = y0 + dy * 2.5;
  line(gx - dy * 1.5, gy + dx * 1.5, gx + dy * 1.5, gy - dx * 1.5, dark, alpha);
  fleck(gx, gy, R[3], alpha);
}

function bladeArc(x: number, y: number, angle: number, radius: number, turn: number, R: Ramp, alpha: number): void {
  for (let k = 1; k <= ARC_STEPS; k++) {
    const a = angle - turn * k * 0.14;
    fleck(x + Math.cos(a) * radius, y + Math.sin(a) * radius, k < 3 ? R[5] : R[4], alpha * (1 - k / (ARC_STEPS + 1)));
  }
}

function tempoPips(
  x: number,
  y: number,
  radius: number,
  rank: number,
  progress: number,
  R: Ramp,
  dark: Color,
  alpha: number,
): void {
  const pips = 4 + rank;
  const lit = Math.ceil(pips * smooth(0, 0.4, progress));
  for (let i = 0; i < pips; i++) {
    const a = -Math.PI / 2 + (i - (pips - 1) / 2) * 0.36;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    fleck(px - 0.5, py, dark, alpha);
    fleck(px + 0.5, py, dark, alpha);
    fleck(px, py - 0.5, dark, alpha);
    fleck(px, py + 0.5, dark, alpha);
    fleck(px, py, i < lit ? WHITE : R[1], alpha);
  }
}

function scissorCut(x: number, y: number, length: number, R: Ramp, dark: Color, alpha: number): void {
  for (const tilt of [-0.62, 0.62]) {
    const dx = Math.cos(tilt) * length * 0.5;
    const dy = Math.sin(tilt) * length * 0.5;
    line(x - dx, y - dy, x + dx, y + dy, dark, alpha * 0.8);
    hairline(x - dx, y - dy - 0.5, x + dx, y + dy - 0.5, R[4], alpha);
  }
}

export function drawTwinBlades(cast: FxCast, kit: ElementKit, progress: number, fade: number, at: FxPoint): void {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const dark = kit.look.dark;
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  if (alpha <= 0) return;
  const s = Math.sqrt(cast.size);
  const open = ease.outCubic(Math.min(1, progress * 4));
  const long = (8 + rank * 3) * s;
  const spread = 0.25 + 0.55 * open;
  const longAngle = -Math.PI / 2 + spread;
  const shortAngle = -Math.PI / 2 - spread;
  blade(at.x, at.y, longAngle, long, R, dark, alpha);
  blade(at.x, at.y, shortAngle, long * 0.65, R, dark, alpha);
  if (alpha >= FX_BUDGET.glowFrom) glow(at.x, at.y, long * 0.7, R[2], 0.06 * alpha);
  if (rank >= 1) {
    bladeArc(at.x, at.y, longAngle, long * 0.5, 1, R, alpha);
    bladeArc(at.x, at.y, shortAngle + Math.PI, long * 0.33, -1, R, alpha);
  }
  const mastered = (run.build.mastery[cast.id] ?? 0) > 0 || rank >= 3;
  if (mastered) tempoPips(at.x, at.y, long * 0.95, rank, progress, R, dark, alpha);
  if (rank >= 3) {
    scissorCut(at.x, at.y, long * 2.8, R, dark, alpha * (1 - smooth(0.1, 0.5, progress)));
    for (let i = 0; i < SATELLITES; i++) {
      const a = (i / SATELLITES) * TAU + progress * 2.5;
      const d = long * (1.2 + 0.6 * open);
      const sx = at.x + Math.cos(a) * d;
      const sy = at.y + Math.sin(a) * d * 0.7;
      blade(sx, sy, a + 0.7, long * 0.45, R, dark, alpha * 0.85);
      blade(sx, sy, a - 0.7, long * 0.32, R, dark, alpha * 0.85);
    }
  }
}
