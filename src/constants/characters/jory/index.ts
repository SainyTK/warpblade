import type { CharacterDef } from "../../../types/character";
import { JORY_SKIN } from "./look";
import { JORY_SKILL_DEFS } from "./skills";

/** Jory, the war drummer: the ninth character, who fights to a beat everyone can see and hear */
export const JORY: CharacterDef = {
  id: "jory",
  kit: "jory",
  name: "Jory",
  title: "The war drummer",
  blurb:
    "He beat the march for an army that never came home. He still keeps time, and the rift has started to move to it. Miss a beat and he is a big man with two sticks.",
  accent: "#5a82ff",
  special: "drumroll",
  base: { ad: 12, ap: 8, hp: 105, mp: 85, stamina: 110, crit: 0.04, move: 1, aspd: 1, haste: 1 },
  growth: { hp: 1, mp: 0.3 },
  skills: JORY_SKILL_DEFS,
  comboHits: 3,
  skin: JORY_SKIN,
};
