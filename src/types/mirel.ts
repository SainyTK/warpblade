import type { Enemy } from "./enemy";
import type { Point } from "./world";

/** states only Mirel enters; her kit runs and poses them */
export type MirelState =
  | "staff"
  | "pendant"
  | "stillCast"
  | "rewind"
  | "clockCast"
  | "handCast"
  | "spellCast"
  | "hour"
  | "noon";

/** the blows of her staff string, and Pendant Strike in the air */
export type StaffBlow = "tick" | "tock" | "toll" | "pendant";

/** the abilities on I, in the order O turns through them: her two from the start and her three spell skills */
export type MirelAbility = "stoppedClock" | "secondHand" | "m_sundial" | "m_foretell" | "m_handsweep";

/** her Stillfield: where it stands, how big, and how long it has been open */
export interface StillfieldView {
  /** which field this is, so its effect knows when it has closed */
  id: number;
  x: number;
  y: number;
  radius: number;
  /** seconds since it opened */
  t: number;
}

/** one point of her recent path, for Rewind */
export interface PathPoint {
  x: number;
  y: number;
  face: number;
  hp: number;
}

/**
 * What Mirel's kit remembers between frames, one copy per player. The guest's HUD reads Sand, the field and the
 * abilities; the host draws the field and the hourglass from it. Points are replaced whole, never changed in place.
 */
export interface MirelMemory {
  /** Sand, 0 to the most her skills allow */
  sand: number;
  /** seconds before Sand refills again after a spend */
  sandWait: number;
  /** the field K holds open, or null */
  field: StillfieldView | null;
  /** seconds before K can open another field */
  fieldCd: number;
  /** foes defeated inside the field now open (Hold the Hour) */
  fieldKills: number;
  /** K is no longer held: the field closes once it has stood its least time */
  fieldLetGo: boolean;
  /** seconds left of the SD bar's flash after a press it could not pay for */
  sandFlash: number;
  /** the blow of the string under way, or the one the next J starts (index into the string) */
  blow: number;
  current: StaffBlow;
  /** seconds left to carry the string on from a free state */
  link: number;
  queued: boolean;
  struck: boolean;
  /** Pendant Strikes left in this airtime */
  pendants: number;
  /** hovering now, seconds of hover left in this airtime, and hovers left in this airtime */
  hovering: boolean;
  hoverLeft: number;
  hovers: number;
  /** Falling Hour: the Pendant Strike is a dive under way, and the share more it deals out of a hover */
  diving: boolean;
  diveBoost: number;
  /** seconds before the next Rewind */
  rewindCd: number;
  /** the Rewind under way: seconds into it, and its start and end */
  rewindT: number;
  rewindFrom: Point | null;
  rewindTo: Point | null;
  /** the Rewind under way already earned its perfect dodge */
  rewindDodged: boolean;
  /** a blow inside this window after a Rewind is a Backswing; Quickened's seconds left */
  sinceRewind: number;
  quickLeft: number;
  /** seconds until each ability on I can be used again */
  clockCd: number;
  handCd: number;
  sundialCd: number;
  foretellCd: number;
  sweepCd: number;
  /** the ability the cast under way is using */
  casting: MirelAbility;
  /** Sundial's dials standing now */
  dials: number;
  /** the special or ultimate under way: its level, its centre and its reach */
  ultLevel: number;
  ultAt: Point | null;
  ultReach: number;
  /** Second Chance: the wave it was last used in */
  secondChance: number;
}

/** what the host alone keeps for Mirel: foes and her path, which never go to a guest */
export interface MirelHostMemory {
  /** her path over the last seconds, oldest first, one point per fixed step */
  path: PathPoint[];
  /** the Rewind under way: the path it plays, newest first, and the HP she lost along it */
  rewound: readonly PathPoint[];
  rewoundLoss: number;
  /** the foe Stopped Clock aims at in the cast under way */
  clockFoe: Enemy | null;
  /** foes the special has stopped */
  stopped: readonly Enemy[];
  /** foes inside her field last step, to count those that fall inside it */
  inside: readonly Enemy[];
  /** damage her blows dealt lately, with the run time each landed, for Undone */
  landed: readonly { damage: number; t: number }[];
  /** Undone: the damage the first blow after a Rewind replays on its foe */
  replay: number;
}

declare module "./skillBehavior" {
  /** Mirel's own skill events */
  interface SkillEvents {
    /** a foe she stopped in time restarts (Entropy) */
    restart: { foe: Enemy };
    /** a Toll landed on these foes (Clockwork Wren) */
    toll: { foes: readonly Enemy[] };
    /** an echo of one of her blows struck a foe */
    echo: { foe: Enemy; blow: StaffBlow };
    /** her Stillfield opened or closed, with the foes inside */
    field: { open: boolean; foes: number; x: number; y: number; radius: number };
    /** a Rewind ended, with the HP it gave back */
    rewind: { healed: number; from: Point; to: Point };
  }
}
