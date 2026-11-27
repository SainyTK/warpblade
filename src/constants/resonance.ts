import type { ElementId } from "../types/campaign";

export const RESONANCE_WEIGHT = { skillLevel: 1, evolved: 3, artLevel: 2 } as const;

export const PROC_DEPTH = 2;

export const BLAZE = {
  tickShare: 0.05,
  tickSharePerRank: 0.008,
  baseStacks: 3,
  stacksPerRank: 1 / 3,
  every: 0.5,
  duration: 3,
  wildfireRank: 20,
  wildfireShare: 0.3,
  wildfireRadius: 34,
} as const;

export const FROST = {
  chill: 1.2,
  baseHitsToFreeze: 9,
  hitsPerRank: 1 / 3,
  fewestHitsToFreeze: 3,
  freeze: 0.7,
  frozenTaken: 0.1,
  frozenTakenPerRank: 0.02,
  shatterRank: 20,
  shatterShare: 0.25,
  shatterRadius: 40,
} as const;

export const STORM = {
  chance: 0.12,
  chancePerRank: 0.03,
  share: 0.25,
  sharePerRank: 0.02,
  ranksPerTarget: 8,
  reach: 72,
  overchargeRank: 20,
} as const;

export const VENOM = {
  takenPerStack: 0.015,
  baseStacks: 10,
  stacksPerRank: 1,
  tickShare: 0.01,
  every: 1,
  duration: 5,
  plagueRank: 20,
  plagueShare: 0.5,
  plagueRadius: 46,
} as const;

export const VOID = {
  chance: 0.06,
  chancePerRank: 0.025,
  mostChance: 0.85,
  share: 0.5,
  sharePerRank: 0.02,
  delay: 0.22,
  riftRank: 24,
} as const;

export const ELEMENT_STATS = {
  blazeArea: 0.015,
  frostDuration: 0.02,
  stormCooldown: 0.012,
  fewestCooldown: 0.5,
  stormSpeed: 0.02,
  voidAmountRanks: 8,
  venomCrit: 0.005,
} as const;

export const FUSION_RANK = 12;

export type FusionId =
  | "thermalShock"
  | "plasma"
  | "causticFire"
  | "hellfire"
  | "superconductor"
  | "blackIce"
  | "stasis"
  | "neurotoxin"
  | "thunderEcho"
  | "entropy";

export interface FusionDef {
  id: FusionId;
  name: string;
  pair: readonly [ElementId, ElementId];
  text: string;
}

export const FUSIONS: readonly FusionDef[] = [
  {
    id: "thermalShock",
    name: "Thermal Shock",
    pair: ["blaze", "frost"],
    text: "Burning foes that are frozen take double damage.",
  },
  {
    id: "plasma",
    name: "Plasma",
    pair: ["blaze", "storm"],
    text: "Arcs set foes burning and leap to one more foe from a burning one.",
  },
  {
    id: "causticFire",
    name: "Caustic Fire",
    pair: ["blaze", "venom"],
    text: "Burns tick harder for every poison stack on the foe.",
  },
  { id: "hellfire", name: "Hellfire", pair: ["blaze", "void"], text: "Echoes lay three times the burn." },
  {
    id: "superconductor",
    name: "Superconductor",
    pair: ["frost", "storm"],
    text: "Arcs deal double damage to chilled foes.",
  },
  {
    id: "blackIce",
    name: "Black Ice",
    pair: ["frost", "venom"],
    text: "Poison makes chilled foes take twice as much.",
  },
  { id: "stasis", name: "Stasis", pair: ["frost", "void"], text: "Echoes freeze and hit harder." },
  { id: "neurotoxin", name: "Neurotoxin", pair: ["storm", "venom"], text: "Arcs lay three poison stacks." },
  { id: "thunderEcho", name: "Thunder Echo", pair: ["storm", "void"], text: "Every echo arcs." },
  {
    id: "entropy",
    name: "Entropy",
    pair: ["venom", "void"],
    text: "Each poison stack on a foe raises the echo chance.",
  },
];

export const RESONANCE_MILESTONES: readonly { element: ElementId; rank: number; name: string }[] = [
  { element: "blaze", rank: BLAZE.wildfireRank, name: "Wildfire" },
  { element: "frost", rank: FROST.shatterRank, name: "Shatter" },
  { element: "storm", rank: STORM.overchargeRank, name: "Overcharge" },
  { element: "venom", rank: VENOM.plagueRank, name: "Plague" },
  { element: "void", rank: VOID.riftRank, name: "Rift Echo" },
];

export const BIG_FOE_BURST_CAP = 0.02;
