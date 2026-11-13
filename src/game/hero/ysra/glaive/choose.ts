import type { MoveId, Situation } from "../../../../types/move";

/** what the glaive reads beyond the shared situation: her skills and her own state, never the foes around her */
export interface GlaiveRead {
  /** a parry opened a counter */
  counter: boolean;
  /** air sweeps she may make before she lands */
  airSweeps: number;
  /** the string's middle blow her skills set: the reverse sweep, the Skyhook or the windmill */
  middle: MoveId;
  /** Warpath is held: J while charging is the running impale */
  warpath: boolean;
  /** Impale twists the glaive for a second hit */
  twist: boolean;
}

/** the sweep in the air, or null once her sweeps are spent until she lands */
function airSweep(s: Situation, r: GlaiveRead): MoveId | null {
  if (s.airHits >= r.airSweeps) return null;
  return s.airHits === 0 ? "airReap" : "airReapRise";
}

/**
 * The glaive blow J starts now. A counter comes first, then the charge and the air. On the floor the string is the
 * same every time, wherever the foes stand: the hip thrust, the middle blow her
 * skills set, and the impale. No blow needs a direction held.
 */
export function pickGlaive(s: Situation, r: GlaiveRead): MoveId | null {
  if (r.counter) return "counterThrust";
  if (!s.ground) return airSweep(s, r);
  if (s.running && r.warpath) return "runningImpale";
  if (s.next === 1) return "hipThrust";
  if (s.next >= s.limit) return r.twist ? "impaleTwist" : "impale";
  return r.middle;
}
