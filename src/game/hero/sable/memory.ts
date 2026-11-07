import type { SableMemory } from "../../../types/sable";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): SableMemory => ({
  ammo: 0,
  reload: null,
  primed: 0,
  charged: 0,
  string: 0,
  cock: 0,
  airShots: 0,
  airJumps: 0,
  airHops: 0,
  hover: 0,
  haste: 0,
  sincePerfect: 99,
  shade: 0,
  perfectUsed: false,
  snareCd: 0,
  netCd: 0,
  decoyCd: 0,
  kegCd: 0,
  snares: 0,
  casting: "snare",
  aim: "level",
  fired: false,
  hopShot: false,
  landed: false,
  slid: 0,
  kicked: false,
  flash: 0,
  flashKind: "perfect",
});

/** the one owner of what Sable's kit remembers */
export const sable: SableMemory = fresh();
rememberPerSeat(objectMemory(sable));

/** a fresh run: a full quiver, nothing set or primed */
export function resetSable(full: number): void {
  Object.assign(sable, fresh(), { ammo: full });
}
