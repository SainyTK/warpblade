import type { OrrinHostMemory, OrrinMemory } from "../../../types/orrin";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): OrrinMemory => ({
  momentum: 0,
  grounded: 0,
  blow: 0,
  current: "lash",
  link: 0,
  queued: false,
  struck: false,
  swept: 0,
  airArcs: 1,
  arc: -1,
  arcSide: 1,
  hooks: 2,
  flight: null,
  latch: null,
  latchAt: null,
  length: 0,
  latchT: 0,
  yankTo: null,
  climbTo: null,
  biteLeft: 0,
  reelBase: 0,
  reeling: false,
  snapped: false,
  sinceRelease: 9,
  releaseSpeed: 0,
  flung: false,
  kicks: 0,
  bestKicks: 0,
  flingBoost: 0,
  boostLeft: 0,
  plumb: false,
  backlineCd: 0,
  backFrom: 0,
  whirlCd: 0,
  pinCd: 0,
  fenceCd: 0,
  tetherCd: 0,
  anchorCd: 0,
  casting: "whirlwall",
  whirlTicks: 0,
  pinAt: null,
  pinLeft: 0,
  ultAt: null,
  ultLevel: 0,
  kites: 0,
});

/** the one owner of what Orrin's kit remembers; the guest's HUD reads it, the host draws the chain from it */
export const orrin: OrrinMemory = fresh();
rememberPerSeat(objectMemory(orrin));

/** foes his kit holds on to, kept to the host */
export const orrinHost: OrrinHostMemory = { zipFoe: null, pinned: null, kicked: [], passed: [] };
rememberPerSeat(objectMemory(orrinHost, true));

/** a fresh run: no Momentum, the chain coiled */
export function resetOrrin(): void {
  Object.assign(orrin, fresh());
  Object.assign(orrinHost, { zipFoe: null, pinned: null, kicked: [], passed: [] });
}
