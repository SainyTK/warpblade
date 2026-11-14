import { HERO_COLORS } from "../../constants/palette";
import type { HeroSkin } from "../../types/character";

/** the look of the hero being drawn; `applySkin` sets it and `HERO_COLORS` together, and the draw code reads both every
 *  frame. The state module dresses the rig as the first hero before anything is drawn. */
export let skin: HeroSkin;

/** dress the rig as this hero */
export function applySkin(s: HeroSkin): void {
  Object.assign(HERO_COLORS, s.colors);
  skin = s;
}
