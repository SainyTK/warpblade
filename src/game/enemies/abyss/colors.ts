import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { hex, ramp } from "../../../utils/color";

/** The creatures of the abyss: ink-black bodies, crimson rim light from the black sun, hot yellow-white eyes. */
export const AC = {
  outline: hex("#020104"),
  bodyDark: hex("#170c1e"),
  body: hex("#2a1636"),
  bodyLight: hex("#45284f"),
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
  /** the hide's deepest shadow, and the cold violet sheen where light grazes it from the top left */
  bodyDeep: hex("#0c0612"),
  sheen: hex("#6c4a8c"),
  /** chitin plates over the hide, from their shadowed seam to the glint on a lit ridge */
  plateDark: hex("#2a1838"),
  plate: hex("#4a2c5c"),
  plateLight: hex("#7a5290"),
  plateGlint: hex("#c8a0dc"),
  /** bone claws and blades, lit edge to shadowed underside */
  clawLight: hex("#fff2f8"),
  clawDark: hex("#a87c96"),
  clawDeep: hex("#5c3a54"),
  /** the lit edge of a tooth */
  toothLight: hex("#fffaf0"),
  /** the wet eyeball: lit top left, shadowed under the lid, and the iris ring around the pupil */
  scleraLight: hex("#f4e6ee"),
  scleraDeep: hex("#5c3c54"),
  irisDeep: hex("#4a0a24"),
  /** the lower half of a small glowing eye, and its hot centre */
  eyeDim: hex("#c88a2a"),
  /** the burning gullet's dark folds */
  gulletDeep: hex("#3c0416"),
} as const;

/** one creature's hide, from its deepest shadow to the sheen where light grazes it */
export interface Hide {
  deep: Color;
  dark: Color;
  body: Color;
  sheen: Color;
}
/** the hides a pack is drawn in, so neighbours that overlap differ in value and hue: ink violet, ashen and wine dark */
const HIDES: readonly Hide[] = [
  { deep: AC.bodyDeep, dark: AC.bodyDark, body: AC.body, sheen: AC.sheen },
  { deep: hex("#120c1c"), dark: hex("#22172e"), body: hex("#3c2a4c"), sheen: hex("#8c6eaa") },
  { deep: hex("#0e050c"), dark: hex("#1c0a18"), body: hex("#34122c"), sheen: hex("#84406a") },
];
/** the hide a creature wears, fixed by a number of its own from 0 to 9 */
export const hideOf = (seed: number): Hide => HIDES[Math.floor(seed * 7) % HIDES.length];

/** crimson void light, dark to white hot, for beams, cracks, orbs and slashes */
export const VOID = ramp(["#1a0612", "#4a0a24", "#8a1438", "#d8325a", "#ff8aa8", "#ffe4ec"]);
export const VOID_SPARKS: readonly Color[] = [hex("#ffe4ec"), hex("#ff8aa8"), hex("#d8325a"), hex("#6a0e2a")];

/** contact and attack damage before wave scaling */
export const ABYSS_HITS = {
  stalkerClaw: 15,
  stalkerRise: 17,
  stalkerTouch: 8,
  eyeBeam: 11,
  mawBite: 22,
  mawOrb: 12,
  mawSlam: 24,
} as const;

/** clear everything drawn below local y, so a body can sink into the floor */
export function clipBelow(s: SpriteCanvas, y: number): void {
  const row = Math.max(0, Math.floor(y * s.res + s.oy));
  if (row < s.h) s.d.fill(0, row * s.w);
}
