import type { CharacterDef } from "../../../types/character";
import { legacySkills } from "../legacySkills";
import { FUSION } from "./fusion";
import { SABLE_SKIN } from "./look";
import { MARKSMAN } from "./marksman";
import { SKIRMISH } from "./skirmish";
import { TRAPPER } from "./trapper";

/** Sable, the hooded hunter: the third character, who fights at range and wins by keeping it */
export const SABLE: CharacterDef = {
  id: "sable",
  kit: "sable",
  name: "Sable",
  title: "The hooded hunter",
  blurb:
    "A forest hunter with a repeating crossbow. She shoots from range, kicks foes away, hops back firing and sets snares. Time the reload for primed bolts. Fast and fragile.",
  accent: "#6ee0a0",
  special: "boltStorm",
  base: { ad: 11, ap: 8, hp: 85, mp: 90, stamina: 110, crit: 0.08, move: 1.12, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 0.9, mp: 0.35 },
  skills: legacySkills([...MARKSMAN, ...SKIRMISH, ...TRAPPER, ...FUSION]),
  comboHits: 3,
  skin: SABLE_SKIN,
};
