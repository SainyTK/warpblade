import type { Pace, SkillKind, UltimateId } from "../types/skill";

export const KIND_LABEL: Record<SkillKind, string> = {
  combo: "Combo",
  movement: "Movement",
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
/** Kael's starting special, shown at the start of the path */
export const SPECIAL_TEXT = {
  name: "Crystal Nova",
  kind: "Special, known from the start",
  text: "Hold U to charge up to four levels, release to strike. A ring of crystal bursts out from Kael, wider each level, and throws foes up. Level 1 costs 25 MP; level 4 spends a full MP bar and reaches the whole screen. An ultimate from the tree replaces it.",
} as const;
