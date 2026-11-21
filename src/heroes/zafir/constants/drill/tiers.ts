import { frame } from "../../../../constants/hero";
import type { DrillProfile } from "../../../../types/drill";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { ARRIVAL } from "../clips";

const SWEEP = sampleKeys(ARRIVAL.keys, frame(4));
const TURNED_SWEEP = { ...SWEEP, mr: 1 };

export const ZAFIR_TIERS: DrillProfile["tiers"] = [
  {
    look: "crescent",
    around: true,
    level: 1,
    cut: SWEEP,
    art: "tier1",
    name: "Sandstorm I",
    threshold: 0.46,
    damage: 30,
    reach: 52,
    height: 22,
    intro: 0.36,
    duration: 0.86,
    color: 0xf8b84a,
  },
  {
    look: "spires",
    around: true,
    level: 2,
    cut: TURNED_SWEEP,
    art: "tier2",
    name: "Sandstorm II",
    threshold: 0.86,
    damage: 60,
    reach: 78,
    height: 30,
    intro: 0.43,
    duration: 1.06,
    color: 0xe08a2a,
  },
  {
    look: "rift",
    around: true,
    level: 3,
    art: "tier3",
    name: "Sandstorm III",
    threshold: 1.27,
    damage: 98,
    reach: 120,
    height: 40,
    intro: 0.51,
    duration: 1.22,
    color: 0xffe4a0,
  },
  {
    look: "nova",
    around: true,
    level: 4,
    art: "tier4",
    name: "Sandstorm IV",
    threshold: 1.72,
    damage: 160,
    reach: 180,
    height: 115,
    intro: 0.64,
    duration: 1.52,
    color: 0xfffbe8,
  },
];

export const TIER_STORM = [
  { crescents: 1, spouts: 0, storm: 0, reach: 0 },
  { crescents: 1, spouts: 1, storm: 0, reach: 0 },
  { crescents: 2, spouts: 1, storm: 2.5, reach: 56 },
  { crescents: 3, spouts: 2, storm: 4, reach: 84 },
] as const;
export const TIER_SHARE = { crescent: 0.3, spout: 0.25, storm: 0.6 };
