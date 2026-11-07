import type { Goal } from "./achievement";
import type { CharmId, RelicId } from "./build";

/** what an unlock opens: a relic or a charm to be dealt, or one more relic or charm slot */
export type UnlockTarget =
  | { type: "relic"; id: RelicId }
  | { type: "charm"; id: CharmId }
  | { type: "slot"; slot: "relic" | "charm"; number: SlotNumber };

/** the slots past the three a new player starts with */
export type SlotNumber = 4 | 5;

/** a relic, charm or slot that is found across runs when its goal is met */
export interface Unlock {
  id: string;
  target: UnlockTarget;
  goal: Goal;
  /** one cryptic line the Codex shows while it is locked */
  hint: string;
  /** the Codex shows only ??? until it is found */
  secret?: boolean;
}

/** something found in a run: an unlock, or the recipe of an evolution made for the first time */
export type Discovery = { type: "unlock"; unlock: Unlock } | { type: "recipe"; relic: RelicId };
