import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { SayaState } from "../types/state";

const fresh = (): SayaState => ({
  breaths: 0,
  rest: 0,
  spent: 0,
  breathDraw: false,
  cd: { line: 0, rise: 0, crescent: 0, rain: 0, still: 0 },
  cdFull: { line: 1, rise: 1, crescent: 1, rain: 1, still: 1 },
  casting: "line",
  wide: false,
  struck: false,
  clicked: false,
  lineFrom: 0,
  perfectSeen: false,
  calmLeft: 0,
  stillCounter: false,
});

/** the one owner of what Saya's kit remembers between presses; a guest's HUD reads her Focus and recharges from it */
export const saya: SayaState = fresh();
rememberPerSeat(objectMemory(saya));

/** a fresh run */
export function resetSayaState(): void {
  Object.assign(saya, fresh());
}

/** a state of hers starts: nothing struck or clicked yet */
export function beginBeat(): void {
  saya.struck = false;
  saya.clicked = false;
}
