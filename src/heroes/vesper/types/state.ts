import type { Enemy } from "../../../types/enemy";
import type { VesperAbility } from "./ability";

/** Vesper's own states, run by her kit: an ability under way, and the stitch of cuts between foes */
declare module "../../../types/hero" {
  interface KitStates {
    vesper: "weave" | "stitch";
  }
}

/** Vesper's own skill events */
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** Tempo reached the top */
    tempoTop: { stacks: number };
    /** a blow of the string or the air string threw a foe up */
    launch: { foe: Enemy };
  }
}

/** what Vesper's kit remembers between presses; each co-op seat keeps its own */
export interface VesperState {
  /** Tempo stacks, and seconds since her last blow landed (Tempo falls once this passes its hold) */
  tempo: number;
  idle: number;
  /** seconds until the next stack falls once Tempo has started to fall */
  fall: number;
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  cd: Record<VesperAbility, number>;
  cdFull: Record<VesperAbility, number>;
  /** the ability under way and whether it is the wide form */
  casting: VesperAbility;
  wide: boolean;
  /** seconds left in which a parry has opened the foes: every blow counts as from behind */
  opened: number;
  /** seconds left of the dusk afterimage after a stitch or the waltz, drawn faint */
  fade: number;
  /** Keen moves landed in a row (Twin Keen) */
  keenStreak: number;
  /** seconds before Slipstream's cut can cut again */
  slipCd: number;
  /** the dodge in play has cut this many foes (Slipstream) */
  slipCut: number;
  /** the best Tempo reached this run */
  runTop: number;
  /** her HP at the last step, so a blow taken is seen and costs Tempo */
  hp: number;
}
