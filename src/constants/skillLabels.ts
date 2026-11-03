import type { Pace, SkillKind, UltimateId } from "../types/skill";

export const KIND_LABEL: Record<SkillKind, string> = {
  combo: "Combo",
  movement: "Movement",
  spell: "Spell",
  enhance: "Enhancement",
  passive: "Passive",
  ultimate: "Ultimate",
  fusion: "Fusion",
};
export const PACE_LABEL: Record<Pace, string> = { early: "Strong early", steady: "Steady", late: "Strong late" };
export const ULT_LABEL: Record<UltimateId, string> = {
  crystalNova: "CRYSTAL NOVA",
  thousandEdges: "THOUSAND EDGES",
  phantomLegion: "PHANTOM LEGION",
  starfall: "STARFALL",
  tempest: "TEMPEST",
};
/** the kind line of a boon card */
export const BOON_KIND = "Boon";
