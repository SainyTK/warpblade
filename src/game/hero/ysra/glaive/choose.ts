import { AIR_SWEEPS, GLAIVE_STRING, GLAIVE_STRING_LOOP } from "../../../../constants/ysra/glaive";
import type { MoveId, Situation } from "../../../../types/move";

/** what the glaive reads beyond the shared situation */
export interface GlaiveRead {
  /** a parry opened a counter */
  counter: boolean;
  /** she left the floor by a jump a moment ago, so Up + J is still the Skyhook */
  rising: boolean;
}

/** the sweep in the air, or null once her sweeps are spent until she lands */
function airSweep(s: Situation): MoveId | null {
  const limit = AIR_SWEEPS.base + (s.perks.has("highReaper") ? AIR_SWEEPS.reaper : 0);
  if (s.airHits >= limit) return null;
  return s.airHits === 0 ? "airReap" : "airReapRise";
}

/** the plain string blow for this place in the string, trading the sweep and the cleave once the list runs out */
function stringBlow(next: number): MoveId {
  if (next <= GLAIVE_STRING.length) return GLAIVE_STRING[next - 1];
  return GLAIVE_STRING_LOOP[(next - GLAIVE_STRING.length - 1) % GLAIVE_STRING_LOOP.length];
}

/**
 * The glaive blow J starts now. A counter comes first, then held keys and the charge, then the air; on the floor the
 * string always opens with the hip thrust (the blow a held J turns into a heft) and always ends with the impale, and
 * in between the foes around her pick the twirl or the haft ram over the plain string.
 */
export function pickGlaive(s: Situation, r: GlaiveRead): MoveId | null {
  const p = s.perks;
  if (r.counter && p.has("counterThrust")) return "counterThrust";
  if (s.up && (s.ground || r.rising)) return "skyhook";
  if (!s.ground) return airSweep(s);
  if (s.running && p.has("warpath")) return "runningImpale";
  if (s.down) return p.has("windmill") ? "windmill" : "groundLash";
  if (s.next === 1) return "hipThrust";
  if (s.next >= s.limit) return "impale";
  if (s.surrounded && s.previous !== "twirl") return "twirl";
  if (s.foeBehindOnly) return "haftRam";
  return stringBlow(s.next);
}
