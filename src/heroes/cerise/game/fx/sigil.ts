import type { ElementKit, FxCast, FxSignature } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawPointArc, drawRapier, drawRose } from "./marks";

export type Sigil = "thrust" | "needle" | "rose";

const GROWS = { mid: 0.35, late: 0.8, mastered: 1.25 } as const;

type Subject = (x: number, y: number, s: number, angle: number, a: number, kit: ElementKit, u: number) => void;

const thrustOf =
  (base: number): Subject =>
  (x, y, s, angle, a, kit, u) => {
    const drive = ease.outCubic(Math.min(1, u * 3));
    const length = s * 3.2;
    const g = base + angle;
    const back = length * (0.6 - drive * 0.6);
    drawRapier(x - Math.cos(g) * back, y - Math.sin(g) * back, length, g, kit.look.ramp, a);
  };

const SUBJECTS: Readonly<Record<Sigil, Subject>> = {
  thrust: thrustOf(0),
  needle: thrustOf(Math.PI / 2),
  rose: (x, y, s, angle, a, kit, u) => drawRose(x, y, s * 1.2, angle + u * 1.4, kit.look.ramp, a),
};

const scaleOf = (cast: FxCast): number => 3 + Math.min(cast.intensity, 2.6) * 2;

export function ceriseSignature(sigil: Sigil, dx: number, dy: number): FxSignature {
  const subject = SUBJECTS[sigil];
  return (cast, _at, kit, u, fade) => {
    const grow = ease.outCubic(smooth(0, 0.2, u));
    if (grow <= 0) return;
    const level = cast.intensity;
    const evolved = cast.tier === "evolved";
    const s = scaleOf(cast) * (0.6 + grow * 0.4);
    const a = fade;
    if (level >= GROWS.mid) drawPointArc(dx, dy, s * 2.2, level >= GROWS.mastered ? 5 : 3, u * 4, a * grow);
    if (level >= GROWS.late) {
      for (const side of [-1, 1]) subject(dx - s * 0.6, dy + side * s * 0.9, s * 0.7, side * 0.08, a * 0.6, kit, u);
    }
    if (level >= GROWS.mastered) drawRose(dx, dy, s * 1.5 * grow, u * 2, kit.look.ramp, a * 0.45);
    if (evolved) {
      for (const side of [-2, -1, 1, 2]) {
        subject(dx - s * 0.4 * Math.abs(side), dy + side * s * 0.8, s * 0.9, side * 0.16, a * 0.8, kit, u - 0.04);
      }
    }
    subject(dx, dy, s, 0, a, kit, u);
  };
}
