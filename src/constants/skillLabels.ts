import type { SkillKind, SkillRisk, UltimateId } from "../types/skill";

export const KIND_LABEL: Record<SkillKind, string> = {
  attack: "Attack",
  movement: "Movement",
  spell: "Spell",
  dot: "Over time",
  summon: "Summon",
  passive: "Passive",
  ultimate: "Ultimate",
};
export const RISK_LABEL: Record<SkillRisk, string> = { easy: "Easy", timed: "Timed", precise: "Precise" };
export const ULT_LABEL: Record<UltimateId, string> = {
  crystalNova: "CRYSTAL NOVA",
  pyreWave: "PYRE WAVE",
  thousandEdges: "THOUSAND EDGES",
  phantomLegion: "PHANTOM LEGION",
  starfall: "STARFALL",
  tempest: "TEMPEST",
  sunspear: "SUNSPEAR",
  volcanicRift: "VOLCANIC RIFT",
  boltStorm: "BOLT STORM",
  deadeye: "DEADEYE",
  quakeDrop: "QUAKE DROP",
  titanThrow: "TITAN THROW",
};
/** the kind line of a boon card */
export const BOON_KIND = "Boon";
/** the path line of charm cards */
export const CHARM_KIND = "Charm";
