import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Pt } from "../shapes";

export interface PlateTones {
  dark: Color;
  base: Color;
  lit: Color;
  rim: Color;
}

export function plate(s: SpriteCanvas, pts: readonly Pt[], ridge: readonly [Pt, Pt], tones: PlateTones): void {
  const center: Pt = [
    pts.reduce((sum, p) => sum + p[0], 0) / pts.length,
    pts.reduce((sum, p) => sum + p[1], 0) / pts.length,
  ];
  const far = Math.floor(pts.length / 2);
  s.begin();
  s.poly(pts, tones.base);
  s.commit();
  s.begin();
  s.poly([pts[0], pts[1], center], tones.lit);
  s.commit(false);
  s.begin();
  s.poly([pts[far], pts[(far + 1) % pts.length], center], tones.dark);
  s.commit(false);
  s.begin();
  s.hairline(pts[0][0], pts[0][1], pts[1][0], pts[1][1], tones.rim);
  s.hairline(ridge[0][0], ridge[0][1], ridge[1][0], ridge[1][1], tones.rim);
  s.commit(false);
}
