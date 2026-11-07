import { PRECISE_TARGETS } from "../../constants/growth";
import type { Enemy } from "../../types/enemy";
import { objectMemory, rememberPerSeat } from "../seatMemory";

/**
 * The foes one pull-off of a precise skill has paid off on: a Keen move, a parry's counter, a primed bolt. The payoff
 * (the skill's extra damage on that pull-off) lands on the first `PRECISE_TARGETS` foes it reaches, nearest first;
 * every other foe the same blow, wave or bolt reaches takes it as the plain move would. Design: docs/skill-design.md
 */
export type Payoff = Set<Enemy>;

export const createPayoff = (): Payoff => new Set();

/** whether the payoff lands on this foe: it already has, or fewer than `PRECISE_TARGETS` foes hold it; a foe it lands
 *  on is kept */
export function payoffLands(payoff: Payoff, e: Enemy): boolean {
  if (payoff.has(e)) return true;
  if (payoff.size >= PRECISE_TARGETS) return false;
  payoff.add(e);
  return true;
}

/** the payoff of the hero's current combo move, fresh with each move; host-only, as it holds foes */
const move: { payoff: Payoff } = { payoff: createPayoff() };
rememberPerSeat(objectMemory(move, true));

/** a combo move starts: its pull-off has paid off on no foe yet */
export function startMovePayoff(): void {
  move.payoff = createPayoff();
}

/** the current combo move's payoff, which its blows and what they send out (a Keen wave) share */
export const movePayoff = (): Payoff => move.payoff;
