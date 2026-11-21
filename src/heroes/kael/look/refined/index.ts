import type { HeroSkin } from "../../../../types/character";
import { KAEL_SKIN } from "..";
import { drawKaelBoots } from "./boots";
import { drawKaelBreastplate } from "./breastplate";

export const REFINED_KAEL_SKIN: HeroSkin = {
  ...KAEL_SKIN,
  parts: { ...KAEL_SKIN.parts, torso: drawKaelBreastplate, leg: drawKaelBoots },
};
