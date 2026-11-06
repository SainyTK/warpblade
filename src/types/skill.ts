import type { SablePerk } from "./sable";
import type { Stats } from "./stats";
import type { YsraPerk } from "./ysra";

/** Kael's abilities */
export type KaelPerk =
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
  | "riposte"
  | "warpStrike"
  | "fireSpell"
  | "iceSpell"
  | "voltSpell"
  | "sunflask"
  | "glacierBloom"
  | "thunderhead";
/** Abilities a skill node switches on. */
export type Perk = KaelPerk | YsraPerk | SablePerk;
export type UltimateId =
  | "crystalNova"
  | "pyreWave"
  | "thousandEdges"
  | "phantomLegion"
  | "starfall"
  | "tempest"
  | "sunspear"
  | "phoenixDive"
  | "volcanicRift"
  | "boltStorm"
  | "deadeye";
export type SkillKind = "combo" | "movement" | "spell" | "enhance" | "passive" | "ultimate" | "fusion" | "evolution";
/** when a path pays off */
export type Pace = "early" | "steady" | "late";
export type BranchId =
  | "blade"
  | "phantom"
  | "arcane"
  | "lance"
  | "bastion"
  | "pyre"
  | "marksman"
  | "skirmish"
  | "trapper"
  | "fusion"
  | "evolution";

export interface SkillNode {
  id: string;
  name: string;
  kind: SkillKind;
  text: string;
  /** the lowest hero level that can be offered it */
  level: number;
  ranks: number;
  /** open from the start if empty; otherwise at least one of these */
  requires: readonly string[];
  /** fusion nodes also need one of these, from another path */
  crossRequires?: readonly string[];
  /** every one of these must be learned too: the ability this node improves */
  needs?: readonly string[];
  /** an evolution: the spell node it evolves, which must be learned */
  evolves?: string;
  /** an evolution: nodes that must be at their full rank */
  mastered?: readonly string[];
  /** nodes that share a group exclude each other: learning one locks the rest for the run */
  group?: string;
  /** added per rank */
  stats?: Partial<Stats>;
  /** multiplies the total per rank: 0.25 is +25% */
  scale?: Partial<Stats>;
  perk?: Perk;
  ultimate?: UltimateId;
}

export interface SkillBranch {
  id: BranchId;
  name: string;
  /** when the path pays off; fusion has none */
  pace?: Pace;
  nodes: readonly SkillNode[];
}

/** a small reward offered when too few skills are left to fill the cards, so a pick always gives something */
export interface Boon {
  id: string;
  name: string;
  text: string;
}

/** one card of a pick */
export type PickOption = { type: "skill"; node: SkillNode; branch: SkillBranch } | { type: "boon"; boon: Boon };
