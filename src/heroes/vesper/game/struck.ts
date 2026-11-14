import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import type { Enemy } from "../../../types/enemy";

/** the foes her hits landed on this step, for what a blow adds after it lands; it holds foes, so only the host keeps it */
const struck: { foes: Enemy[] } = { foes: [] };
rememberPerSeat(objectMemory(struck, true));

/** one of her hits landed on a foe */
export function noteStruck(e: Enemy): void {
  if (!struck.foes.includes(e)) struck.foes.push(e);
}

/** the foes struck since the last call, cleared */
export function takeStruck(): Enemy[] {
  const foes = struck.foes;
  struck.foes = [];
  return foes;
}

/** a new step starts with no foe struck */
export function clearStruck(): void {
  struck.foes = [];
}
