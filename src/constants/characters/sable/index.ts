import type { CharacterDef } from "../../../types/character";
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
  special: "boltStorm",
  base: { ad: 11, ap: 8, hp: 85, mp: 90, stamina: 110, crit: 0.08, move: 1.12, aspd: 1, haste: 1 },
  growth: { ad: 0.7, ap: 0.5, hp: 4, mp: 1.5 },
  branches: [MARKSMAN, SKIRMISH, TRAPPER, FUSION],
  startRanks: { t_snare: 1 },
  skin: SABLE_SKIN,
};
