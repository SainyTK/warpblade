import type { UnlockDef } from "../../types/unlock";
import type { FusionId } from "../resonance";
import { HERO_UNLOCKS } from "./heroes";
import { ITEM_UNLOCKS } from "./items";
import { SKILL_UNLOCKS } from "./skills";
import { STAGE_UNLOCKS } from "./stages";

export { heroUnlockId } from "./heroes";
export { itemUnlockId } from "./items";
export { STARTER_SKILLS, skillUnlockId } from "./skills";
export { HYPER_PRICE, hyperRewardId, hyperUnlockId, stageOpeners, stageUnlockId } from "./stages";

export const UNLOCKS: readonly UnlockDef[] = [...STAGE_UNLOCKS, ...HERO_UNLOCKS, ...ITEM_UNLOCKS, ...SKILL_UNLOCKS];

export const fusionRecipeId = (id: FusionId): string => `fusion:${id}`;
