import { GRIT } from "../../../constants/hulda/grit";
import type { HuldaMemory } from "../../../types/hulda";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): HuldaMemory => ({
  grit: GRIT.start,
  quiet: 0,
  safe: 0,
  flinch: 0,
  held: null,
  crushed: null,
  holdT: 0,
  knees: 0,
  blow: 0,
  link: 0,
  queued: false,
  struck: false,
  throwKind: "forward",
  bellowCd: 0,
  tauntCd: 0,
  chainCd: 0,
  stompCd: 0,
  wallCd: 0,
  airFisted: false,
  airGrabbed: false,
  landed: false,
  rushCd: 0,
  carried: [],
  passed: [],
  fury: 0,
  furyT: 0,
  hitFrom: 0,
  healWait: 0,
  ironT: 0,
  iron: 0,
});

/** the one owner of what Hulda's kit remembers */
export const hulda: HuldaMemory = fresh();
rememberPerSeat(objectMemory(hulda));

/** a fresh run: one plate of Grit, empty hands */
export function resetHulda(): void {
  Object.assign(hulda, fresh());
}
