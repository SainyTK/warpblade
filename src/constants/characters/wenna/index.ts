import type { CharacterDef } from "../../../types/character";
import { WENNA_SKIN } from "./look";
import { WENNA_SKILL_DEFS } from "./skills";

/** Wenna, the lamplighter: the seventh character, a summoner who fights through the wax figures her lamp lights */
export const WENNA: CharacterDef = {
  id: "wenna",
  kit: "wenna",
  name: "Wenna",
  title: "The lamplighter",
  blurb:
    "She walks the rift's dark roads with a hooked lamp and a satchel of candles. Every candle she lights stands up and fights for her. Weak alone, never alone.",
  accent: "#b48cff",
  special: "greatWick",
  base: { ad: 6, ap: 11, hp: 92, mp: 100, stamina: 100, crit: 0.05, move: 0.9, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.0, mp: 0.3 },
  skills: WENNA_SKILL_DEFS,
  comboHits: 3,
  skin: WENNA_SKIN,
};
