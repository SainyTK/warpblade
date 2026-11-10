import type { CharacterDef } from "../../../types/character";
import { TALLIS_SKIN } from "./look";
import { TALLIS_SKILL_DEFS } from "./skills";

/** Tallis, the gloam knife: the eighth character, a shadow assassin who strikes from where foes are not looking */
export const TALLIS: CharacterDef = {
  id: "tallis",
  kit: "tallis",
  name: "Tallis",
  title: "The gloam knife",
  blurb:
    "He learned his trade in the hour between day and night, when nobody looks twice. Two short knives, no armour, no patience for a fair fight. Every foe has a back.",
  accent: "#f08ad0",
  special: "gloaming",
  base: { ad: 11, ap: 8, hp: 90, mp: 80, stamina: 100, crit: 0.1, move: 1.08, aspd: 1.1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 0.9, mp: 0.35 },
  skills: TALLIS_SKILL_DEFS,
  comboHits: 3,
  skin: TALLIS_SKIN,
};
