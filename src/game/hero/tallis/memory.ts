import { GLOAM } from "../../../constants/tallis/gloam";
import type { TallisHostMemory, TallisMemory } from "../../../types/tallis";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): TallisMemory => ({
  gloam: GLOAM.start,
  gloamFlash: 0,
  unseen: false,
  veil: false,
  veilT: 0,
  veilLock: 0,
  veilEnd: -1,
  ambushNext: false,
  ambushLeft: 0,
  freeVeilWave: -1,
  waveSeen: -1,
  blow: 0,
  current: "flick",
  link: 0,
  queued: false,
  struck: false,
  dropStabs: 1,
  diving: false,
  leaps: 0,
  leapOpen: 0,
  afterLeap: false,
  sinkT: 0,
  sinkMax: 0,
  sinks: 1,
  sinkCd: 0,
  sinkDodged: false,
  sinkFrom: 0,
  sinkLetGo: false,
  risingQueued: false,
  sinceRise: 9,
  plummet: false,
  knotCd: 0,
  hamCd: 0,
  needlesCd: 0,
  markCd: 0,
  caltropsCd: 0,
  casting: "smokeKnot",
  ultLevel: 0,
  ultAt: null,
  backKills: 0,
});

const freshHost = (): TallisHostMemory => ({
  wasHidden: false,
  lost: [],
  clouds: [],
  marks: [],
  targets: [],
  passed: [],
  visited: 0,
  dark: null,
});

/** the one owner of what Tallis's kit remembers; the guest's HUD reads Gloam, the Veil and the abilities from it */
export const tallis: TallisMemory = fresh();
rememberPerSeat(objectMemory(tallis));

/** the foes and clouds his kit holds on to, kept to the host */
export const tallisHost: TallisHostMemory = freshHost();
rememberPerSeat(objectMemory(tallisHost, true));

/** a fresh run: half a bar of Gloam, no Veil, no clouds */
export function resetTallis(): void {
  Object.assign(tallis, fresh());
  Object.assign(tallisHost, freshHost());
}
