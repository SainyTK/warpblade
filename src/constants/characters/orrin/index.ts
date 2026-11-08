import type { CharacterDef } from "../../../types/character";
import { ORRIN_SKIN } from "./look";
import { ORRIN_SKILL_DEFS } from "./skills";

/** Orrin, the chain dancer: the fifth character, who swings on a hooked chain and lashes foes at its tip */
export const ORRIN: CharacterDef = {
  id: "orrin",
  kit: "orrin",
  name: "Orrin",
  title: "The chain dancer",
  blurb:
    "A rift drifter with a brass hook on a long chain. He swings from crystals, ledges and the air itself, flings himself across the stage and lashes foes at the chain's tip. Never stands still for long.",
  accent: "#e8b04a",
  special: "grandPendulum",
  base: { ad: 11, ap: 8, hp: 95, mp: 85, stamina: 130, crit: 0.06, move: 1.05, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.1, mp: 0.2 },
  skills: ORRIN_SKILL_DEFS,
  comboHits: 3,
  skin: ORRIN_SKIN,
};
