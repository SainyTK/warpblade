import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color, Ramp } from "../../../types/color";
import { scale } from "../../../utils/color";

export interface WingStyle {
  span: number;
  chord: number;
  fingers: number;
  feathers: Ramp;
  tip: Color;
  tipHot: Color;
}

export interface WingPose {
  x: number;
  y: number;
  angle: number;
  spread: number;
  dim: number;
  charge: number;
}

type Pt = readonly [number, number];

function frame(pose: WingPose): (u: number, v: number) => Pt {
  const cx = Math.cos(pose.angle);
  const cy = Math.sin(pose.angle);
  const flip = -cy <= 0 ? 1 : -1;
  const px = -cy * flip;
  const py = cx * flip;
  return (u, v) => [pose.x + cx * u + px * v, pose.y + cy * u + py * v];
}

export function featherWing(s: SpriteCanvas, pose: WingPose, style: WingStyle): void {
  const at = frame(pose);
  const span = style.span * (0.45 + 0.55 * pose.spread);
  const chord = style.chord * (0.55 + 0.45 * pose.spread);
  const tone = (c: Color) => (pose.dim < 1 ? scale(c, pose.dim) : c);
  const F = style.feathers;
  const quill = Math.max(0.7, style.chord * 0.1);
  const wrist = span * 0.48;
  const tips: Pt[] = [];
  s.begin();
  for (let i = 0; i < style.fingers; i++) {
    const k = i / Math.max(1, style.fingers - 1);
    const tip: Pt = [span * (1 - k * 0.38), chord * (0.15 + k * 0.85)];
    tips.push(tip);
    const [x0, y0] = at(wrist * (0.9 - k * 0.2), chord * (0.15 + k * 0.4));
    const [x1, y1] = at(tip[0], tip[1]);
    s.taper(x0, y0, x1, y1, quill * 1.5, quill * 0.55, tone(F[1]), 0);
  }
  s.shadeEdges(tone(F[1]), tone(F[2]), tone(F[0]));
  s.commit();
  s.begin();
  const rows = Math.max(3, Math.round(wrist / (quill * 2.6)));
  for (let i = 0; i <= rows; i++) {
    const u = wrist * (1 - i / rows) * 0.95 + span * 0.02;
    const [x0, y0] = at(u, chord * 0.25);
    const [x1, y1] = at(u - quill * 0.6, chord * (0.92 - (i / rows) * 0.18));
    s.taper(x0, y0, x1, y1, quill * 1.6, quill * 0.9, tone(F[2]), 0);
  }
  s.shadeEdges(tone(F[2]), tone(F[3]), tone(F[1]));
  s.commit();
  s.begin();
  const [r0x, r0y] = at(0, chord * 0.16);
  const [r1x, r1y] = at(wrist * 1.05, chord * 0.06);
  s.taper(r0x, r0y, r1x, r1y, chord * 0.3, chord * 0.17, tone(F[3]), -0.6);
  s.shadeEdges(tone(F[3]), tone(F[4]), tone(F[2]));
  for (let u = quill; u < wrist; u += quill * 2) {
    const [x, y] = at(u, chord * 0.3);
    s.set(x, y, tone(F[2]));
    const [lx, ly] = at(u + quill, chord * 0.14);
    if (pose.dim >= 1) s.set(lx, ly, tone(F[4]));
  }
  s.commit();
  s.begin();
  tips.forEach(([u, v], i) => {
    const [x, y] = at(u, v);
    const hot = pose.charge > 0.5 && i % 2 === 0;
    s.set(x, y, hot ? style.tipHot : tone(style.tip));
    const [bx, by] = at(u - quill, v - quill * 0.3);
    s.set(bx, by, hot ? style.tip : tone(F[3]));
  });
  const [gx, gy] = at(wrist * 0.8, -0.7);
  if (pose.dim >= 1) s.set(gx, gy, F[4]);
  s.commit(false);
}
