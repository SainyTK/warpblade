import type { Pace, SkillKind, UltimateId } from "../types/skill";

export const KIND_LABEL: Record<SkillKind, string> = {
  combo: "Combo",
  movement: "Movement",
  spell: "Spell",
  enhance: "Enhancement",
  passive: "Passive",
  ultimate: "Ultimate",
  fusion: "Fusion",
  evolution: "Evolution",
};
export const PACE_LABEL: Record<Pace, string> = { early: "Strong early", steady: "Steady", late: "Strong late" };
export const ULT_LABEL: Record<UltimateId, string> = {
  crystalNova: "CRYSTAL NOVA",
  pyreWave: "PYRE WAVE",
  thousandEdges: "THOUSAND EDGES",
  phantomLegion: "PHANTOM LEGION",
  starfall: "STARFALL",
  tempest: "TEMPEST",
  sunspear: "SUNSPEAR",
  phoenixDive: "PHOENIX DIVE",
  volcanicRift: "VOLCANIC RIFT",
  boltStorm: "BOLT STORM",
  deadeye: "DEADEYE",
  quakeDrop: "QUAKE DROP",
  titanThrow: "TITAN THROW",
};
/** the kind line of a boon card */
export const BOON_KIND = "Boon";
/** the path line of relic and charm cards */
export const CARD_KIND = { relic: "Relic", charm: "Charm" } as const;
