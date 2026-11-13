import type { MoveId, Situation } from "../types/move";

/** the ground string in order, before its last hit; the last hit a combo allows is always a finisher */
export const GROUND_CHAIN: readonly MoveId[] = ["stepCut", "risingBackhand", "twinFang"];
/** the air string in order: a wheel, a scissor cut, then (with Sky Dance) the stomp that takes Kael down to the floor */
export const AIR_CHAIN: readonly MoveId[] = ["airWheel", "airScissor", "airStomp"];
/** the level of Sky Dance from which the first air hit after a double jump spins, and from which the stomp is a meteor */
const SKY_DANCE = { whirl: 3, meteor: 6 } as const;
/** the level of Reaping Sweep from which the 3rd hit is the crescent turn, and of Keen Edge from which a Keen 4th hit is
 *  the hop cleave */
const CRESCENT_FROM = 5;
const CLEAVE_FROM = 7;

const level = (s: Situation, id: string): number => s.skills[id] ?? 0;

/** the next air hit, or null once the air string is spent until Kael lands */
function airMove(s: Situation): MoveId | null {
  if (s.airHits >= s.airLimit) return null;
  if (s.doubleJumped && !s.whirled && level(s, "k_skydance") >= SKY_DANCE.whirl) return "whirl";
  const id = AIR_CHAIN[Math.min(s.airHits, AIR_CHAIN.length - 1)];
  return id === "airStomp" && level(s, "k_skydance") >= SKY_DANCE.meteor ? "meteor" : id;
}

/** the last hit: a Keen hop cleave with Keen Edge, the launch with Skybreaker, otherwise the falling smash */
function finisher(s: Situation): MoveId {
  if (s.keen && level(s, "k_keen") >= CLEAVE_FROM) return "hopCleave";
  if (level(s, "k_skyward")) return "skybreaker";
  return "smash";
}

/** a plain hit of the string as Kael's skills change it: the sweep opens it, the phase cut or crescent turn is its 3rd */
function stringHit(s: Situation): MoveId {
  if (s.next === 1 && level(s, "k_reap")) return "sweep";
  if (s.next === 3 && level(s, "k_phase")) return "phaseCut";
  if (s.next === 3 && level(s, "k_reap") >= CRESCENT_FROM) return "crescentTurn";
  return GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}

/**
 * The move J starts now: the last hit's finisher, otherwise the string's next hit, the same wherever the foes stand.
 * No held key or dash changes it. Null when the air string is spent.
 */
export function chooseMove(s: Situation): MoveId | null {
  if (!s.ground) return airMove(s);
  if (s.next === s.limit) return finisher(s);
  return stringHit(s);
}
