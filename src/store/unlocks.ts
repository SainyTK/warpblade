import { CHARM_SLOTS, RELIC_SLOTS } from "../constants/growth";
import type { CharmId, RelicId } from "../types/build";
/** Unlocks across runs: which relics and charms can be dealt, how many slots, which evolution recipes are known. */
export const relicUnlocked = (_id: RelicId): boolean => true;
export const charmUnlocked = (_id: CharmId): boolean => true;
export const relicSlots = (): number => RELIC_SLOTS;
export const charmSlots = (): number => CHARM_SLOTS;
export const knowsRecipe = (_id: RelicId): boolean => false;
/** an evolution happened: its recipe is known from now on */
export function learnRecipe(_id: RelicId): void {}
