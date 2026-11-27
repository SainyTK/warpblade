import { progress } from "../../../../game/state";
import type { ElementKit, FxCast, FxSignature } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawPointArc, drawRapier, drawRose } from "./marks";

export type Sigil = "thrust" | "needle" | "rose";

const GROWS = { mid: 0.35, late: 0.8 } as const;
const THORN_RING = 8;

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

const scaleOf = (cast: FxCast): number => 5 + Math.min(cast.intensity, 2.6) * 2;

export function ceriseSignature(sigil: Sigil, dx: number, dy: number): FxSignature {
  const subject = SUBJECTS[sigil];
  return (cast, _at, kit, u, fade) => {
    const grow = ease.outCubic(smooth(0, 0.2, u));
    if (grow <= 0) return;
    const level = cast.intensity;
    const evolved = cast.tier === "evolved";
    const mastered = (progress.build.mastery[cast.id] ?? 0) > 0;
    const s = scaleOf(cast) * (0.6 + grow * 0.4);
    const a = fade;
    if (level >= GROWS.mid) drawPointArc(dx, dy, s * 2.2, mastered ? 5 : 3, u * 4, a * grow);
    if (level >= GROWS.late) {
      for (const side of [-1, 1]) subject(dx - s * 0.6, dy + side * s * 0.9, s * 0.7, side * 0.08, a * 0.6, kit, u);
    }
    if (mastered) drawRose(dx, dy, s * 1.6 * grow, u * 2, kit.look.ramp, a * 0.7);
    if (evolved) {
      const spread = s * (1.4 + ease.outCubic(Math.min(1, u * 2.5)) * 2.2);
      for (let i = 0; i < THORN_RING; i++) {
        const g = (i / THORN_RING) * TAU + u * 0.8;
        kit.motif(dx + Math.cos(g) * spread, dy + Math.sin(g) * spread * 0.7, g, 3 + s * 0.4, a * 0.9, 3);
      }
      for (const side of [-2, -1, 1, 2]) {
        subject(dx - s * 0.4 * Math.abs(side), dy + side * s * 0.8, s * 0.9, side * 0.16, a * 0.8, kit, u - 0.04);
      }
    }
    subject(dx, dy, s, 0, a, kit, u);
  };
}
