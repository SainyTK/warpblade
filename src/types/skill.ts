import type { Stats } from "./stats";

export type UltimateId =
  | "crystalNova"
  | "pyreWave"
  | "thousandEdges"
  | "phantomLegion"
  | "starfall"
  | "tempest"
  | "sunspear"
  | "volcanicRift"
  | "boltStorm"
  | "deadeye"
  | "quakeDrop"
  | "titanThrow"
  | "unbroken"
  | "grandPendulum"
  | "maelstrom"
  | "hourOfStillness"
  | "eternalNoon"
  | "greatWick"
  | "thousandCandles"
  | "gloaming"
  | "eclipse"
  | "drumroll"
  | "grandFinale"
  | "berserk"
  | "unendingRage";
/** what a skill is, for its card colour and the contract's least counts per hero (docs/skill-design.md) */
export type SkillKind = "attack" | "movement" | "spell" | "dot" | "summon" | "passive" | "ultimate";
/** how hard a skill is to pull off: the harder, the more it deals */
export type SkillRisk = "easy" | "timed" | "precise";
/** the button a skill attaches to, or `auto` for one that runs on its own */
export type SkillButton = "J" | "K" | "L" | "I" | "O" | "U" | "jump" | "auto";

/** one level of a skill, or its evolution: the card line and what the skill's code reads */
export interface SkillLevel {
  /** what this level changes, one short line on the card */
  text: string;
  /** flat stats the hero has while the skill is at this level (the level's total, not added per level) */
  stats?: Partial<Stats>;
  /** stat percentages at this level: 0.25 is +25% */
  scale?: Partial<Stats>;
  /** numbers the skill's code reads through `skillValues(id)`: damage multiples, counts, chances, seconds */
  values?: Readonly<Record<string, number>>;
}

/** a skill's final form, given by a chest once the skill is at level 8 and its partner is held at `EVOLVE_PARTNER_LEVEL` */
export interface SkillEvolution {
  /** another skill of the same hero */
  partner: string;
  name: string;
  text: string;
  /** replaces the level 8 row */
  row: SkillLevel;
}

/** one of a hero's 20 skills. Design: docs/skill-design.md */
export interface SkillDef {
  /** unique across every hero, since recipes and damage sources are kept by id */
  id: string;
  name: string;
  kind: SkillKind;
  risk: SkillRisk;
  button: SkillButton;
  /** what the skill does, shown on the card of a skill not held yet */
  text: string;
  /** levels 1 to 8, index 0 is level 1 */
  levels: readonly SkillLevel[];
  evolution: SkillEvolution;
  /** an ultimate skill: the ultimate it puts on U in place of the hero's special */
  ultimate?: UltimateId;
}

/** a small reward offered when too few skills are left to fill the cards, so a pick always gives something */
export interface Boon {
  id: string;
  name: string;
  text: string;
}
