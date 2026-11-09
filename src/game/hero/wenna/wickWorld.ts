import type { Wick } from "../../../types/wenna";
import { heroSlot } from "../../coopHooks";

/**
 * Every Wenna's Wicks, in one list kept to the host's world rather than to one player's memory, so foes meet the Wicks
 * of any Wenna in the room. Each Wenna tends only her own (`owner` is her place in the room, 0 in solo play).
 */
let wicks: Wick[] = [];
let nextId = 1;

/** every Wick standing or melting, of every Wenna */
export const allWicks = (): readonly Wick[] => wicks;

/** the Wicks of the Wenna in play, standing or melting */
export const ownWicks = (): Wick[] => wicks.filter((w) => w.owner === heroSlot());

/** a Wick that stands: risen out of its pool and not melting */
export const standing = (w: Wick, rise: number): boolean => w.melt < 0 && w.t >= rise && w.hp > 0;

/** a fresh id for a new Wick */
export const newWickId = (): number => nextId++;

export function addWick(w: Wick): void {
  wicks.push(w);
}

/** melted Wicks leave the list */
export function dropMelted(meltTime: number): void {
  wicks = wicks.filter((w) => w.melt < meltTime);
}

/** a new run: no Wick stands anywhere */
export function clearWicks(): void {
  wicks = [];
}
