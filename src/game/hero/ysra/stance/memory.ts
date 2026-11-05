import type { StanceMemory } from "../../../../types/ysra/stance";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";

/** the one owner of what Ysra's stance part remembers */
export const stance: StanceMemory = {
  launched: false,
  landed: false,
  vaultNext: false,
  entry: null,
  airVaults: 0,
  dived: false,
  face: 1,
  faceBefore: 1,
  turned: Number.POSITIVE_INFINITY,
  braced: 0,
  counter: 0,
  shield: 0,
  shouldered: new Map(),
};

/** a fresh run: nothing planted, primed or shouldered */
export function resetStance(): void {
  Object.assign(stance, {
    launched: false,
    landed: false,
    vaultNext: false,
    entry: null,
    airVaults: 0,
    dived: false,
    face: 1,
    faceBefore: 1,
    turned: Number.POSITIVE_INFINITY,
    braced: 0,
    counter: 0,
    shield: 0,
  });
  stance.shouldered.clear();
}
rememberPerSeat(objectMemory(stance));
