import type { Enemy } from "./enemy";

/** states only Brannoc enters; his kit runs and poses them */
export type BrannocState = "axe" | "hatchet" | "frenzy" | "abilityCast" | "spellCast" | "roar" | "lastCleave";

/** the blows of his axe string, Hatchet Drop in the air, and the Hunt chop his warp lands with */
export type AxeBlow = "hew" | "reave" | "cleave" | "hatchet" | "huntChop";

/** the abilities on I, in the order O turns through them: his three from the start and his three spell skills */
export type BrannocAbility = "frenzy" | "warCry" | "redCrescent" | "b_geyser" | "b_axeThrow" | "b_pact";

/** how the debt changed: HP spent into it, won back out of it, faded, or forfeited to a blow */
export type DebtChange = "spend" | "repay" | "fade" | "forfeit";

/**
 * What Brannoc's kit remembers between frames, one copy per player. The guest's HUD reads the debt, its flashes and the
 * abilities from it, and his look reads Bloodied, Frenzy and Berserk.
 */
export interface BrannocMemory {
  /** HP spent and not yet won back, and seconds since HP was last spent or won back (the fade starts after a while) */
  debt: number;
  debtIdle: number;
  /** seconds left of the debt segment's bright flash on a repay, and of its white flash and shards on a forfeit */
  repayFlash: number;
  forfeitT: number;
  /** the debt's share of max HP when it was forfeited, so the shards fall from where the segment was */
  forfeitFrom: number;
  forfeitWidth: number;
  /** HP seen last step, so a blow that took HP forfeits the debt */
  lastHp: number;
  /** HP at or under the Bloodied line, as last seen, and seconds of the crimson rim flash on crossing in */
  bloodied: boolean;
  rimFlash: number;
  /** the axe string: the blow under way or the one the next J starts (index), which blow it is, and its timing */
  blow: number;
  current: AxeBlow;
  queued: boolean;
  /** hits of the blow under way already dealt (the Bloodied Cleave spins twice) */
  hits: number;
  /** the Bloodied Cleave: whether this Cleave spins twice, decided as it starts */
  double: boolean;
  /** Spinning Reap: turns of this Cleave still to spin after its own, and seconds into the turn under way */
  reapLeft: number;
  reapT: number;
  /** the Cleave under way has slammed into the floor */
  cracked: boolean;
  /** seconds after a blow ends in which J carries the string on */
  link: number;
  /** a blow has landed: seconds the axe edge glints crimson */
  glint: number;
  /** Hatchet Drop left in this airtime */
  hatchets: number;
  /** Frenzy: seconds left of it, and the wait after it ends before I can start it again */
  frenzyT: number;
  frenzyWait: number;
  /** seconds until each ability on I can be used again */
  cryCd: number;
  crescentCd: number;
  geyserCd: number;
  axeCd: number;
  pactCd: number;
  /** the ability the cast under way is using, and whether it is the wide form (I held) */
  casting: BrannocAbility;
  castWide: boolean;
  /** Blood Pact: seconds left of it, and whether its first Bloodied blow has been spent */
  pactT: number;
  pactFirst: boolean;
  /** Berserk: seconds left, its charge level, and Last Cleave's strikes left */
  berserkT: number;
  berserkLevel: number;
  cleaves: number;
  /** foes repaid on by the blow under way, and which swing that count belongs to */
  repaid: number;
  repaidSwing: number;
  /** foes felled while Bloodied this run (On the Edge) */
  bloodiedKills: number;
  /** seconds to the next puff of red steam */
  steamT: number;
}

/** what the host alone keeps for Brannoc, which never goes to a guest */
export interface BrannocHostMemory {
  /** where he stood as he hurled the axe for his warp, and whether he was in the air */
  from: number;
  air: boolean;
}

declare module "./skillBehavior" {
  /** Brannoc's own skill events */
  interface SkillEvents {
    /** the debt changed by `amount` HP */
    debt: { change: DebtChange; amount: number };
    /** Frenzy began or ended */
    frenzy: { on: boolean };
    /** his warp (the Hunt) landed, beside the foe it went for (null when it found none), from where he threw */
    hunt: { foe: Enemy | null; air: boolean; from: number };
    /** he crossed into or out of Bloodied */
    bloodied: { on: boolean };
    /** Berserk began (with its charge level) or ended */
    berserk: { on: boolean; level: number };
    /** a Cleave struck, with the foes it landed on and whether it was a Bloodied spin */
    cleave: { foes: Enemy[]; bloodied: boolean };
  }
}
