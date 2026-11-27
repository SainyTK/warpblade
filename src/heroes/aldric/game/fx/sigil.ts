import type { ElementKit, FxCast, FxSignature } from "../../../../types/skillFx";
import { ease, smooth } from "../../../../utils/math";
import { drawKite, drawSun, drawSword, drawValorCrown, drawValorHalo } from "./marks";

export type Sigil = "shield" | "sword" | "sun";

const GROWS = { mid: 0.35, late: 0.8, mastered: 1.25 } as const;

type Subject = (x: number, y: number, s: number, tilt: number, a: number, detail: boolean, kit: ElementKit) => void;

const SUBJECTS: Readonly<Record<Sigil, Subject>> = {
  shield: (x, y, s, tilt, a, detail, kit) => drawKite(x, y, s, tilt, kit.look.ramp[4], a, detail),
  sword: (x, y, s, tilt, a) => drawSword(x, y, s, tilt, a),
  sun: (x, y, s, tilt, a) => drawSun(x, y, s, tilt, a),
};

const scaleOf = (cast: FxCast): number => 3 + Math.min(cast.intensity, 2.6) * 2.2;

export function sigilSignature(sigil: Sigil, lift: number): FxSignature {
  const subject = SUBJECTS[sigil];
  return (cast, _at, kit, u, fade) => {
    const grow = ease.outCubic(smooth(0, 0.22, u));
    if (grow <= 0) return;
    const level = cast.intensity;
    const evolved = cast.tier === "evolved";
    const s = scaleOf(cast) * grow;
    const y = -lift;
    const spin = u * 1.6;
    const a = fade;
    if (level >= GROWS.late) drawValorCrown(0, y, s * (evolved ? 3.2 : 2.2), spin, a * (1 - u * 0.6));
    if (level >= GROWS.mastered) {
      drawValorHalo(0, y - s * 1.9, s * 1.2, spin * 2, a);
      for (const side of [-1, 1]) subject(side * s * 1.9, y + s * 0.4, s * 0.55, side * 0.35, a * 0.6, false, kit);
    }
    if (evolved) {
      for (const side of [-1, 1]) subject(side * s * 1.3, y - s * 0.25, s * 0.85, side * 0.5, a * 0.85, true, kit);
    }
    subject(0, y, s, 0, a, level >= GROWS.mid, kit);
  };
}
