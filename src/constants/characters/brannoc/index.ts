import type { CharacterDef } from "../../../types/character";
import { BRANNOC_SKIN } from "./look";
import { BRANNOC_SKILL_DEFS } from "./skills";

/** Brannoc, the berserker: the tenth character, who pays for his power in his own HP and wins it back by striking */
export const BRANNOC: CharacterDef = {
  id: "brannoc",
  kit: "brannoc",
  name: "Brannoc",
  title: "The red oath",
  blurb:
    "He swore to the rift that he would give it his blood before he gave it ground. It keeps taking him up on it. Every cut he takes makes the axe lighter.",
  accent: "#eadbb8",
  special: "berserk",
  base: { ad: 13, ap: 6, hp: 125, mp: 70, stamina: 100, crit: 0.06, move: 1.02, aspd: 0.9, haste: 1 },
  growth: { hp: 1.2, mp: 0.25 },
  skills: BRANNOC_SKILL_DEFS,
  comboHits: 3,
  skin: BRANNOC_SKIN,
};
