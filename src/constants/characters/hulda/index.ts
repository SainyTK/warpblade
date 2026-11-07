import type { CharacterDef } from "../../../types/character";
import { HULDA_SKIN } from "./look";
import { HULDA_SKILL_DEFS } from "./skills";

/** Hulda, the iron grappler: the fourth character, who grabs foes, throws them into each other and takes blows on armour */
export const HULDA: CharacterDef = {
  id: "hulda",
  kit: "hulda",
  name: "Hulda",
  title: "The iron grappler",
  blurb:
    "A rift wrestler in iron gauntlets. She grabs foes and throws them into each other, suplexes them into the floor and shrugs off blows with armour she earns in the fight. Slow, short reach, very hard to stop.",
  accent: "#ff5f6d",
  special: "quakeDrop",
  base: { ad: 12, ap: 6, hp: 120, mp: 70, stamina: 120, crit: 0.04, move: 0.9, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.3, mp: 0.2 },
  skills: HULDA_SKILL_DEFS,
  comboHits: 3,
  skin: HULDA_SKIN,
};
