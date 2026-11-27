import { fleck, hairline, line, polygon } from "../../../../engine/frame";
import type { Color } from "../../../../types/color";
import type { ElementKit, FxAt, FxCast } from "../../../../types/skillFx";
import { smooth } from "../../../../utils/math";
import { JADE } from "../../look";

export type Point = [number, number];

export const rankOf = (cast: FxCast): number => cast.feel.rank;

export const grade = (cast: FxCast): number => 1 + cast.gradeInTier * 0.3;

export const fadeOut = (progress: number, fade: number, from = 0.7): number => fade * (1 - smooth(from, 1, progress));

export const headOf = (at: FxAt): number =>
  at.toX === undefined ? (at.reach ?? 20) : (at.toX - at.x) * (at.face ?? 1);

export function drawFxSword(kit: ElementKit, x: number, y: number, angle: number, length: number, alpha: number): void {
  if (alpha <= 0.02) return;
  const R = kit.look.ramp;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const at = (along: number, side: number): Point => [x + ax * along - ay * side, y + ay * along + ax * side];
  const half = Math.max(0.7, length * 0.06);
  const grip = length * 0.22;
  const shoulder = length - half * 2.5;
  polygon([at(grip, half), at(shoulder, half), at(length, 0), at(shoulder, -half), at(grip, -half)], R[4], alpha);
  hairline(...at(grip, half + 0.4), ...at(shoulder, half + 0.4), R[1], alpha);
  hairline(...at(shoulder, half + 0.4), ...at(length + 0.4, 0), R[1], alpha);
  hairline(...at(grip, -half - 0.4), ...at(shoulder, -half - 0.4), R[2], alpha);
  hairline(...at(shoulder, -half - 0.4), ...at(length + 0.4, 0), R[2], alpha);
  hairline(...at(grip + 1, 0), ...at(length - 1.5, 0), R[5], alpha);
  line(...at(grip, half * 2.6 + 0.6), ...at(grip, -half * 2.6 - 0.6), JADE[2], alpha);
  hairline(...at(grip, half * 2.6), ...at(grip, -half * 2.6), JADE[4], alpha);
  line(...at(1, 0), ...at(grip - 1, 0), JADE[1], alpha);
  fleck(...at(-0.5, 0), JADE[4], alpha);
  hairline(...at(0, 0), ...at(-length * 0.18, length * 0.06), JADE[3], alpha * 0.8);
}

export function drawMoon(
  kit: ElementKit,
  x: number,
  y: number,
  tall: number,
  thick: number,
  alpha: number,
  dir = 1,
): void {
  if (alpha <= 0.02) return;
  const R = kit.look.ramp;
  const steps = 12;
  const outer: Point[] = [];
  const inner: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / steps;
    const w = thick * Math.sin((Math.PI * i) / steps);
    const ox = x + Math.cos(a) * tall * 0.5 * dir;
    const oy = y + Math.sin(a) * tall;
    outer.push([ox, oy]);
    inner.push([ox - w * dir, oy]);
  }
  polygon([...outer, ...[...inner].reverse()], R[2], alpha);
  for (let i = 0; i < steps; i++) {
    hairline(outer[i][0], outer[i][1], outer[i + 1][0], outer[i + 1][1], i % 3 === 1 ? R[5] : R[4], alpha);
    hairline(inner[i][0], inner[i][1], inner[i + 1][0], inner[i + 1][1], R[3], alpha * 0.8);
  }
}

export function drawPetal(kit: ElementKit, x: number, y: number, angle: number, size: number, alpha: number): void {
  if (alpha <= 0.02) return;
  const R = kit.look.ramp;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const at = (u: number, v: number): Point => [x + ax * u - ay * v, y + ay * u + ax * v];
  polygon([at(-size, 0), at(0, size * 0.55), at(size, 0), at(0, -size * 0.55)], R[3], alpha);
  hairline(...at(-size, 0), ...at(0, size * 0.6), R[1], alpha);
  hairline(...at(0, size * 0.6), ...at(size, 0), R[1], alpha);
  hairline(...at(-size * 0.6, 0), ...at(size * 0.8, 0), R[2], alpha * 0.8);
  hairline(...at(-size, 0), ...at(0, -size * 0.55), R[4], alpha);
  hairline(...at(0, -size * 0.55), ...at(size, 0), R[5], alpha);
}

export function drawArc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  from: number,
  to: number,
  color: Color,
  alpha: number,
): void {
  const n = Math.max(6, Math.ceil(Math.abs(to - from) * Math.max(rx, ry) * 0.6));
  for (let i = 0; i < n; i++) {
    const a0 = from + ((to - from) * i) / n;
    const a1 = from + ((to - from) * (i + 1)) / n;
    hairline(
      cx + Math.cos(a0) * rx,
      cy + Math.sin(a0) * ry,
      cx + Math.cos(a1) * rx,
      cy + Math.sin(a1) * ry,
      color,
      alpha,
    );
  }
}
