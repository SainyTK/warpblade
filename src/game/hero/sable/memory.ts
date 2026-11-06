import type { SableMemory } from "../../../types/sable";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

const fresh = (): SableMemory => ({
  ammo: 0,
  reload: null,
  primed: 0,
  aim: "level",
  fired: false,
  snareCd: 0,
  snares: 0,
  hopShot: false,
  landed: false,
  airHopped: false,
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
