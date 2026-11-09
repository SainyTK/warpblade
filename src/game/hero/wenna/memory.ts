import { WAX_BAR } from "../../../constants/wenna/wax";
import type { WennaHostMemory, WennaMemory } from "../../../types/wenna";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): WennaMemory => ({
  wax: WAX_BAR.start,
  waxFlash: 0,
  wicks: 0,
  blow: 0,
  current: "tap",
  link: 0,
  queued: false,
  struck: false,
  drops: 1,
  hops: 0,
  hopped: false,
  atFeet: false,
  swapCharges: 1,
  swapCd: 0,
  swapFrom: null,
  swapTo: null,
  swapDodged: false,
  untouchable: 0,
  kindleCd: 0,
  beckonCd: 0,
  volleyCd: 0,
  poolCd: 0,
  effigyCd: 0,
  casting: "kindle",
  freeWick: false,
  ultLevel: 0,
  wickKills: 0,
});

const freshHost = (): WennaHostMemory => ({
  quarries: [],
  swapWick: null,
});

/** the one owner of what Wenna's kit remembers; the guest's HUD reads Wax, the Wick count and the abilities from it */
export const wenna: WennaMemory = fresh();
rememberPerSeat(objectMemory(wenna));

/** the foes and the Wick her kit holds on to, kept to the host */
export const wennaHost: WennaHostMemory = freshHost();
rememberPerSeat(objectMemory(wennaHost, true));

/** a fresh run: Wax at its start, no Quarry */
export function resetWenna(): void {
  Object.assign(wenna, fresh());
  Object.assign(wennaHost, freshHost());
}
