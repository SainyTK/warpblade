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
/** the hero's own presses: their blows, their abilities and their ultimate */
export type HeroSource = "attacks" | "abilities" | "ultimate";
/** what dealt a hit, for the end of run screen: one of the hero's own presses, or a skill's id for a hit it dealt on its own */
export type SourceId = HeroSource | (string & {});

export interface CharmDef {
  id: CharmId;
  name: string;
  /** what one level gives, shown on the card */
  text: string;
  maxLevel: number;
  /** card weight; owned charms count `CARD_WEIGHT.ownedCharm` times */
  weight: number;
}

/** the multipliers the build gives every source; 1 (or 0 for counts) is no change */
export interface BuildStats {
  /** damage on every hit */
  might: number;
  /** cooldowns: 0.6 is 40% shorter */
  cooldown: number;
  /** extra projectiles, summons, strikes */
  amount: number;
  area: number;
  duration: number;
  /** skill projectile speed */
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

/** the pick tools a run counts: what is left of each */
export type PickToolKey = "rerolls" | "skips" | "banishes";

/** one hero's skills and charms in a run */
export interface Build {
  /** held skills by id, at levels 1 to 8 */
  skills: Record<string, number>;
  charms: Partial<Record<CharmId, number>>;
  /** skills in their evolved form */
  evolved: string[];
  /** banished card keys (`skill:<id>`, `charm:might`), never dealt again this run */
  banished: string[];
  rerolls: number;
  skips: number;
  banishes: number;
  /** Flow stacks and seconds since the hero's last hit */
  flow: number;
  flowIdle: number;
  /** what the last chest opened gave, while its screen is still up; empty otherwise */
  chest: ChestReward[];
}

/** one card of a pick: a skill or charm at the level it reaches, or a boon */
export type Card =
  | { type: "skill"; id: string; level: number }
  | { type: "charm"; id: CharmId; level: number }
  | { type: "boon"; id: string };

/** what one chest gave */
export type ChestReward =
  | { type: "evolve"; id: string }
  | { type: "skill"; id: string; level: number }
  | { type: "charm"; id: CharmId; level: number }
  | { type: "heal" };
