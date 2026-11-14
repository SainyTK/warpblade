import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { SPIRIT } from "../constants/swords";
import type { YunState } from "../types/state";

const fresh = (): YunState => ({
  swords: SPIRIT.start,
  regen: SPIRIT.regen,
  away: Array.from({ length: SPIRIT.most }, () => 0),
  wait: { stream: 0, lotus: 0 },
  waitFull: { stream: 1, lotus: 1 },
  castAbility: "stream",
  castWide: false,
  tassel: 0,
  tasselSpeed: 0,
  pommelX: Number.NaN,
  pommelVx: 0,
});

/** the one owner of what Yun's kit remembers: his spirit swords, his abilities' waits and his tassel's swing */
export const yun: YunState = fresh();
rememberPerSeat(objectMemory(yun));

/** a fresh run */
export function resetYunState(): void {
  Object.assign(yun, fresh());
}
