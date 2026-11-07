import type { SkillNode } from "./skill";

/** relics: damage sources the hero carries that act on their own */
export type RelicId = "shards" | "wisp" | "daggers" | "storm" | "aura" | "bell" | "echo" | "thorns";
/** charms: passives that multiply a stat for every source */
export type CharmId =
  | "might"
  | "haste"
  | "multitude"
  | "reach"
  | "persistence"
  | "swiftness"
  | "fortune"
  | "vigor"
  | "insight"
  | "resonance";
/** what dealt a hit, for the end of run screen: the hero's blows, their MP abilities, their ultimate, or a relic */
export type SourceId = "attacks" | "abilities" | "ultimate" | RelicId;

/** one level of a relic: only the fields a relic uses are set */
export interface RelicLevel {
  /** damage of one hit */
  damage: number;
  /** seconds between volleys, pulses or strikes */
  cooldown?: number;
  /** projectiles, shards, strikes or pools in one go */
  amount?: number;
  /** foes one projectile passes through before it is spent */
  pierce?: number;
  /** a size multiplier on the relic's own base size */
  area?: number;
  /** seconds a shard ring, pool or effect lasts */
  duration?: number;
  /** a speed multiplier on the relic's own base speed */
  speed?: number;
  /** what this level changes, shown on the card */
  text: string;
}

export interface RelicDef {
  id: RelicId;
  name: string;
  /** what the relic does, shown on the card for a new relic */
  text: string;
  /** levels 1 to 8, index 0 is level 1 */
  levels: readonly RelicLevel[];
  evolution: { charm: CharmId; name: string; text: string; stats: RelicLevel };
}

export interface CharmDef {
  id: CharmId;
  name: string;
  /** what one level gives, shown on the card */
  text: string;
  maxLevel: number;
  /** card weight; owned charms count three times */
  weight: number;
}

/** the multipliers the build gives every source; 1 (or 0 for counts) is no change */
export interface BuildStats {
  /** damage on every hit */
  might: number;
  /** cooldowns: 0.6 is 40% shorter */
  cooldown: number;
  /** extra projectiles, shards, strikes */
  amount: number;
  area: number;
  duration: number;
  /** relic projectile speed */
  speed: number;
  /** 1 is no luck bonus */
  luck: number;
  /** experience gained */
  growth: number;
  /** max HP */
  vigor: number;
  /** HP per second */
  regen: number;
  /** added to crit chance */
  crit: number;
  /** move speed */
  move: number;
  /** Flow's stack cap */
  flowCap: number;
}

/** what a relic remembers between steps: timers, angles, its live projectiles */
export type RelicMemory = Record<string, unknown>;

/** One relic's code. Called once per hero that holds it, with that hero swapped in. */
export interface RelicBehavior {
  /** memory for a hero who has just taken the relic */
  create(): RelicMemory;
  /** level is 1 to 8; evolved replaces the level's stats with the evolution's */
  update(memory: RelicMemory, level: number, evolved: boolean, dt: number): void;
  /** drawn in front of the hero */
  draw?(memory: RelicMemory, level: number, evolved: boolean): void;
  /** drawn behind the hero and foes */
  drawBack?(memory: RelicMemory, level: number, evolved: boolean): void;
}

/** one hero's relics and charms in a run */
export interface Build {
  relics: Partial<Record<RelicId, number>>;
  charms: Partial<Record<CharmId, number>>;
  evolved: RelicId[];
  /** banished card keys (`relic:wisp`, `charm:might`, `skill:<node id>`), never dealt again this run */
  banished: string[];
  rerolls: number;
  skips: number;
  banishes: number;
  /** Flow stacks and seconds since the hero's last hit */
  flow: number;
  flowIdle: number;
  /** hits the hero's own blows, abilities and ultimate have landed this run; Echo Blade counts them */
  heroHits: number;
  /** runtime memory of each relic held */
  memory: Partial<Record<RelicId, RelicMemory>>;
  /** what the last chest opened gave, while its screen is still up; empty otherwise */
  chest: ChestReward[];
}

/** one card of a pick */
export type Card =
  | { type: "relic"; id: RelicId; level: number }
  | { type: "charm"; id: CharmId; level: number }
  | { type: "skill"; node: SkillNode }
  | { type: "boon"; id: string };

/** what one chest gave */
export type ChestReward =
  | { type: "evolve"; id: RelicId }
  | { type: "relic"; id: RelicId; level: number }
  | { type: "charm"; id: CharmId; level: number }
  | { type: "heal" };
