import type { Enemy } from "../../../types/enemy";
import { staggerFoe } from "../../enemies/stagger";
import { objectMemory, rememberPerSeat } from "../../seatMemory";

/** foes her blows struck while they stood stopped in time, with the stagger each blow left waiting */
const held = { foes: [] as { foe: Enemy; seconds: number }[] };
rememberPerSeat(objectMemory(held, true));

/** a stopped foe cannot stagger, so the blow's stagger waits for it to restart */
export function holdStagger(e: Enemy, seconds: number): void {
  const before = held.foes.find((h) => h.foe === e)?.seconds ?? 0;
  held.foes = [...held.foes.filter((h) => h.foe !== e), { foe: e, seconds: Math.max(before, seconds) }];
}

/** a foe that restarted takes the stagger its last blows left waiting, so a string on a stopped foe still holds it */
export function releaseHeldStaggers(): void {
  for (const h of held.foes) if (h.foe.hp > 0 && h.foe.stopped <= 0) staggerFoe(h.foe, h.seconds);
  held.foes = held.foes.filter((h) => h.foe.hp > 0 && h.foe.stopped > 0);
}

/** a fresh run: nothing waits */
export function clearHeldStaggers(): void {
  held.foes = [];
}
