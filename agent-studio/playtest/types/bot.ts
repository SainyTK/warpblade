import type { GameSnapshot, PickCard } from "./snapshot";

export type PolicyName = "mash" | "skilled";
/** what a bot wants this tick: keys held down, and keys pressed once */
export interface Intent {
  hold: string[];
  tap: string[];
}
/** what a policy remembers between ticks, in game milliseconds */
export interface BotMemory {
  now: number;
  lastDodge: number;
  lastVault: number;
  ultUntil: number;
  /** J is held for the warp until then */
  warpUntil: number;
}
export interface Policy {
  name: PolicyName;
  decide(state: GameSnapshot, memory: BotMemory): Intent;
  choosePick(cards: readonly PickCard[]): number;
}
