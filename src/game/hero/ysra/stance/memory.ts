import type { StanceMemory } from "../../../../types/ysra/stance";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";

/** the vault's state when nothing is planted, primed or shouldered */
const fresh = () => ({
  launched: false,
  landed: false,
  high: false,
  vaultCd: 0,
  vaultFull: 0,
  vaultNext: false,
  entry: null,
  airVaults: 0,
  dives: 0,
  face: 1,
  faceBefore: 1,
  turned: Number.POSITIVE_INFINITY,
  counter: 0,
  walked: 0,
  carried: [],
});

/** the one owner of what Ysra's stance part remembers */
export const stance: StanceMemory = { ...fresh(), shouldered: new Map() };

/** a fresh run: nothing planted, primed or shouldered */
export function resetStance(): void {
  Object.assign(stance, fresh());
  stance.shouldered.clear();
}
rememberPerSeat(objectMemory(stance));
