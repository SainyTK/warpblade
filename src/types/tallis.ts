import type { Enemy } from "./enemy";
import type { Point } from "./world";

/** states only Tallis enters; his kit runs and poses them */
export type TallisState =
  | "knife"
  | "dropStab"
  | "sink"
  | "rise"
  | "risingCut"
  | "knotCast"
  | "hamstring"
  | "spellCast"
  | "gloaming"
  | "eclipse";

/** the blows of his two knife strings, Drop Stab in the air, Rising Cut out of the pool, and Hamstring's sweep */
export type KnifeBlow =
  | "flick"
  | "cross"
  | "heelKick"
  | "backstab"
  | "twist"
  | "gutSlash"
  | "dropStab"
  | "risingCut"
  | "hamstring";

/** the abilities on I, in the order O turns through them: his two from the start and his three spell skills */
export type TallisAbility = "smokeKnot" | "hamstring" | "t_needles" | "t_markDusk" | "t_caltrops";

/** why the Veil came on or ended */
export type VeilCause = "press" | "empty" | "hurt" | "strike" | "free" | "leap";

/** a Smoke Knot's cloud: where it stands, its size, and how long it has stood */
export interface SmokeCloud {
  x: number;
  /** the floor it stands on */
  y: number;
  w: number;
  h: number;
  t: number;
  life: number;
}

/**
 * What Tallis's kit remembers between frames, one copy per player. The guest's HUD reads Gloam, the Veil and the
 * abilities, and his sprite on every screen reads the Veil and the pool from it.
 */
export interface TallisMemory {
  /** Gloam, 0 to the most his skills allow */
  gloam: number;
  /** seconds left of the GL bar's blink after a press it could not pay for */
  gloamFlash: number;
  /** no foe near faces him and he is out of the Veil, so Gloam refills: the bar's edge glows */
  unseen: boolean;
  /** the Veil is up, and the seconds since it came on */
  veil: boolean;
  veilT: number;
  /** seconds before K can raise the Veil again */
  veilLock: number;
  /** seconds left of the Veil after his first blow out of it, -1 while no blow has landed */
  veilEnd: number;
  /** the next knife blow is an Ambush: a sure crit */
  ambushNext: boolean;
  /** seconds left in which a blow after a rise behind a foe is an Ambush */
  ambushLeft: number;
  /** Quiet Step: the wave whose free Veil was used, and the wave last seen */
  freeVeilWave: number;
  waveSeen: number;
  /** the knife string: the blow under way or the one the next J starts (index), and which blow it is */
  blow: number;
  current: KnifeBlow;
  link: number;
  queued: boolean;
  struck: boolean;
  /** Drop Stabs left in this airtime */
  dropStabs: number;
  /** Drop Stab is diving */
  diving: boolean;
  /** Night Leap: extra jumps left in this airtime, and seconds left after a rise in which one is open */
  leaps: number;
  leapOpen: number;
  /** a Drop Stab after a Night Leap (Night Leap's bonus and Raven Drop) */
  afterLeap: boolean;
  /** Sink: seconds sunk, the longest this Sink may last, Sinks left before the wait, and the wait */
  sinkT: number;
  sinkMax: number;
  sinks: number;
  sinkCd: number;
  /** the Sink under way met a blow in its first moment (once per Sink) */
  sinkDodged: boolean;
  /** the Sink under way began here; L was let go; J was pressed in the pool */
  sinkFrom: number;
  sinkLetGo: boolean;
  risingQueued: boolean;
  /** seconds since the last rise, for Rising Cut's window and Night Leap */
  sinceRise: number;
  /** L in the air: falling straight down to sink on landing */
  plummet: boolean;
  /** seconds until each ability on I can be used again */
  knotCd: number;
  hamCd: number;
  needlesCd: number;
  markCd: number;
  caltropsCd: number;
  /** the ability the cast under way is using */
  casting: TallisAbility;
  /** the special or ultimate under way: its level, where he crouched, and seconds since it was released */
  ultLevel: number;
  ultAt: Point | null;
  /** foes felled by blows from behind this run (Knife in the Dark) */
  backKills: number;
}

/** a foe that lost sight of him, with seconds left of its question mark */
export interface LostCue {
  foe: Enemy;
  left: number;
}

/** a foe marked by Mark of Dusk, with seconds left */
export interface DuskMark {
  foe: Enemy;
  left: number;
}

/** what the host alone keeps for Tallis: foes and clouds, which never go to a guest */
export interface TallisHostMemory {
  /** he was hidden last step, so becoming hidden shows the lost cue once */
  wasHidden: boolean;
  lost: LostCue[];
  clouds: SmokeCloud[];
  marks: DuskMark[];
  /** the foes the special or ultimate under way strikes, in order */
  targets: Enemy[];
  /** the foes Sink's pool has passed under this Sink (Deep Shadow) */
  passed: Enemy[];
  /** foes the special or ultimate under way has visited so far */
  visited: number;
  /** the dark the special or ultimate under way lays over the scene, kept until it has lifted */
  dark: { fading: boolean; k: number } | null;
}

declare module "./skillBehavior" {
  /** Tallis's own skill events */
  interface SkillEvents {
    /** the Veil came on or ended, and why */
    veil: { on: boolean; cause: VeilCause };
    /** a Sink ended in a rise, from where to where */
    sink: { from: number; to: number };
    /** an Ambush landed on this foe */
    ambush: { foe: Enemy };
    /** one of his blows from behind landed, and whether it felled the foe */
    backstab: { foe: Enemy; kill: boolean };
  }
}
