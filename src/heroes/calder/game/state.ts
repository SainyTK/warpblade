import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { CHAMBER_ROUNDS } from "../constants/chamber";
import type { CalderAbility } from "../types/ability";
import type { CalderState } from "../types/state";

const waits = (): Record<CalderAbility, number> => ({ slug: 0, scatter: 0, flare: 0, chain: 0, charge: 0 });

const fresh = (): CalderState => ({
  rounds: CHAMBER_ROUNDS,
  hot: false,
  click: 0,
  reloadPressed: false,
  reloadQuick: false,
  shotCd: waits(),
  shotCdFull: { slug: 1, scatter: 1, flare: 1, chain: 1, charge: 1 },
  shotAbility: "slug",
  shotWide: false,
  backFired: false,
  hopping: false,
  recoil: 0,
  freeTrigger: false,
  fired: 0,
  warpFromX: 0,
  warpFromY: 0,
  triggerStreak: 0,
  breakCuts: 0,
  breakDone: 0,
  breakBlow: 0,
  breakReach: 0,
});

/** the one owner of what Calder's kit remembers: his chamber, his shots' recharges and the ultimate under way */
export const calder: CalderState = fresh();
rememberPerSeat(objectMemory(calder));

/** a fresh run: the chamber starts full */
export function resetCalderState(rounds: number): void {
  Object.assign(calder, fresh(), { rounds });
}

/** the timers run down */
export function tickCalderState(dt: number): void {
  calder.click = Math.max(0, calder.click - dt);
  calder.recoil = Math.max(0, calder.recoil - dt);
}
