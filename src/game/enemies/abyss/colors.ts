import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { hex, ramp } from "../../../utils/color";

/** The creatures of the abyss: ink-black bodies, crimson rim light from the black sun, hot yellow-white eyes. */
export const AC = {
  outline: hex("#020104"),
  bodyDark: hex("#0e0812"),
  body: hex("#1c1024"),
  bodyLight: hex("#2e1a3a"),
  rim: hex("#e0507a"),
  rimSoft: hex("#8a2a52"),
  eye: hex("#ffe27a"),
  eyeHot: hex("#ffffff"),
  claw: hex("#f0c8d8"),
  gullet: hex("#7a0a2a"),
  gulletHot: hex("#ff4a5a"),
  tooth: hex("#e8dcd0"),
  toothDark: hex("#9a8478"),
  sclera: hex("#d4bcc8"),
  scleraShade: hex("#8a6a80"),
  vein: hex("#b02a4a"),
  pupil: hex("#08020a"),
  glow: hex("#d02a4a"),
} as const;

/** crimson void light, dark to white hot, for beams, cracks, orbs and slashes */
export const VOID = ramp(["#1a0612", "#4a0a24", "#8a1438", "#d8325a", "#ff8aa8", "#ffe4ec"]);
export const VOID_SPARKS: readonly Color[] = [hex("#ffe4ec"), hex("#ff8aa8"), hex("#d8325a"), hex("#6a0e2a")];

/** contact and attack damage before wave scaling */
export const ABYSS_HITS = {
  stalkerClaw: 15,
  stalkerRise: 17,
  eyeBeam: 11,
  mawBite: 22,
  mawOrb: 12,
  mawSlam: 24,
} as const;

/** light the top edge of the drawn silhouette, as if the black sun's corona caught it from above */
export function rimLight(s: SpriteCanvas, c: Color, from = 0): void {
  const { w, h, d } = s;
  for (let y = 1; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (d[i] && !d[i - w] && x - s.ox >= from) d[i] = c;
    }
}

/** clear everything drawn below local y, so a body can sink into the floor */
export function clipBelow(s: SpriteCanvas, y: number): void {
  const row = Math.max(0, Math.floor(y + s.oy));
  if (row < s.h) s.d.fill(0, row * s.w);
}
