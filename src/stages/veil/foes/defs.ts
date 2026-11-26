import type { EnemyDef } from "../../../constants/enemies";
import type { StageFoeType } from "../../../types/enemy";

export const VEIL_DEFS = {
  riftknight: { rank: "minion", hp: 110, xp: 20, weight: 0.7, launchable: true, name: "Rift Knight" },
} satisfies Partial<Record<StageFoeType, EnemyDef>>;
