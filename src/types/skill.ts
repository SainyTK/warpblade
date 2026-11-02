import type { Stats } from "./stats";

/** Abilities a skill node switches on. */
export type Perk =
  | "flowingChain"
  | "launcher"
  | "sweep"
  | "phaseFinish"
  | "skybreaker"
  | "berserker"
  | "ironWill"
  | "doubleJump"
  | "airDash"
  | "hang"
  | "whirlwind"
  | "meteorDrop"
  | "dashStrike"
  | "runThrust"
  | "doubleDash"
  | "quickstep"
  | "warpcraft"
  | "blinkCombo"
  | "spellblade"
  | "siphon"
  | "quickCast"
  | "pyromancy"
  | "cryomancy"
  | "stormcalling"
  | "staticStep"
  | "shatter"
  | "ignition"
  | "phantomEdge"
  | "manaBlade"
  | "gravityWell"
  | "riposte";
export type UltimateId = "crystalNova" | "thousandEdges" | "phantomLegion" | "starfall" | "tempest";
export type SkillKind = "combo" | "movement" | "enhance" | "passive" | "ultimate" | "fusion";
/** when a path pays off */
export type Pace = "early" | "steady" | "late";

export interface SkillNode {
  id: string;
  name: string;
  kind: SkillKind;
  text: string;
  /** the lowest hero level that can learn it */
  level: number;
  ranks: number;
  /** skill points per rank */
  cost: number;
  /** open from the start if empty; otherwise at least one of these */
  requires: readonly string[];
  /** fusion nodes also need one of these, from another path */
  crossRequires?: readonly string[];
  /** nodes that share a group exclude each other: learning one locks the rest for the run */
  group?: string;
  /** column on the path, left to right */
  tier: number;
  /** added per rank */
  stats?: Partial<Stats>;
  /** multiplies the total per rank: 0.25 is +25% */
  scale?: Partial<Stats>;
  perk?: Perk;
  ultimate?: UltimateId;
}

export interface SkillBranch {
  id: string;
  name: string;
  /** when the path pays off; fusion has none */
  pace?: Pace;
  pros: string;
  cons: string;
  nodes: readonly SkillNode[];
}

/** why a node can or cannot be learned right now */
export type NodeStatus = "maxed" | "learnable" | "excluded" | "needsLevel" | "needsPath" | "needsPoints";
