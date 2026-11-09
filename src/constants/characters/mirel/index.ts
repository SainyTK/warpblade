import type { CharacterDef } from "../../../types/character";
import { MIREL_SKIN } from "./look";
import { MIREL_SKILL_DEFS } from "./skills";

/** Mirel, the hour keeper: the sixth character, a time mage who slows foes in a field, echoes her blows and rewinds */
export const MIREL: CharacterDef = {
  id: "mirel",
  kit: "mirel",
  name: "Mirel",
  title: "The hour keeper",
  blurb:
    "A keeper of the rift's broken clocks. She holds moments still, strikes once and again half a second later, and walks back out of a mistake before it lands. Fragile, patient, and never where the blow expected her.",
  accent: "#6fe0c8",
  special: "hourOfStillness",
  base: { ad: 9, ap: 12, hp: 88, mp: 110, stamina: 100, crit: 0.05, move: 0.95, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.0, mp: 0.3 },
  skills: MIREL_SKILL_DEFS,
  comboHits: 3,
  skin: MIREL_SKIN,
};
