import { KAEL } from "../../constants/characters/kael";
import { HERO_COLORS } from "../../constants/palette";
import type { HeroSkin } from "../../types/character";

type Look = Omit<HeroSkin, "colors">;
const look = (s: HeroSkin): Look => ({
  head: s.head,
  headBack: s.headBack,
  weapon: s.weapon,
  reach: s.reach,
  ramp: s.ramp,
  glow: s.glow,
  sparks: s.sparks,
});

/** the look of the hero being drawn, Kael's until another is chosen; the draw code reads this and HERO_COLORS every frame */
export const skin: Look = look(KAEL.skin);

/** dress the rig as this hero */
export function applySkin(s: HeroSkin): void {
  Object.assign(HERO_COLORS, s.colors);
  Object.assign(skin, look(s));
}
