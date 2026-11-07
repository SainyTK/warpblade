import type { MoveId, Situation } from "../../../../types/move";

/** what the glaive reads beyond the shared situation, from the foes and her skills */
export interface GlaiveRead {
  /** a parry opened a counter and Counter Thrust is held */
  counter: boolean;
  /** a foe hovers over her within the sky thrust's reach, and none stands level with her close in front */
  overhead: boolean;
  /** Skyhook is held: the sky thrust hooks */
  hook: boolean;
  /** the nearest foe ahead stands just past the thrust's reach, where the ground lash catches it */
  far: boolean;
  /** air sweeps she may make before she lands */
  airSweeps: number;
  /** Windmill is held, and whether foes on both sides or a crowd in front set it off */
  windmill: "none" | "spin" | "full";
  spins: boolean;
  /** Warpath is held: J while charging is the running impale; with Rail Lance, a full lunge */
  warpath: boolean;
  railLunge: boolean;
  /** Impale twists the glaive for a second hit */
  twist: boolean;
}

/** the sweep in the air, or null once her sweeps are spent until she lands */
function airSweep(s: Situation, r: GlaiveRead): MoveId | null {
  if (s.airHits >= r.airSweeps) return null;
  return s.airHits === 0 ? "airReap" : "airReapRise";
}

/** the string's middle blow: the windmill or twirl when foes stand around her, the haft ram for a foe only behind, the
 *  overhead cleave for a foe knocked down in front, the ground lash for a foe knocked just out of reach, otherwise the
 *  reverse sweep */
function middleBlow(s: Situation, r: GlaiveRead): MoveId {
  if (r.windmill !== "none" && r.spins) return r.windmill === "full" ? "windmillFull" : "windmill";
  if (s.surrounded) return "twirl";
  if (s.foeBehindOnly) return "haftRam";
  if (s.foeDown) return "overheadCleave";
  if (r.far) return "groundLash";
  return "reverseSweep";
}

/**
 * The glaive blow J starts now. A counter comes first, then the charge and the air; on the floor the string always
 * opens with the hip thrust (the blow a held J turns into a heft) and always ends with the impale, and its middle blow
 * is picked by the foes around her. A foe hovering over her with nothing level in front takes any blow of the string:
 * the sky thrust, or the Skyhook, since every other ground blow would pass under it. No blow needs a direction held.
 */
export function pickGlaive(s: Situation, r: GlaiveRead): MoveId | null {
  if (r.counter) return "counterThrust";
  if (!s.ground) return airSweep(s, r);
  if (s.running && r.railLunge) return "railLunge";
  if (s.running && r.warpath) return "runningImpale";
  if (r.overhead) return r.hook ? "skyhook" : "skyThrust";
  if (s.next === 1) return "hipThrust";
  if (s.next >= s.limit) return r.twist ? "impaleTwist" : "impale";
  return middleBlow(s, r);
}
