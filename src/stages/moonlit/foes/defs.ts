import type { EnemyDef } from "../../../constants/enemies";
import type { StageFoeType } from "../../../types/enemy";

export const MOONLIT_DEFS = {
  lanternshade: { rank: "minion", hp: 40, xp: 10, weight: 0, launchable: true, name: "Lantern Shade" },
} satisfies Partial<Record<StageFoeType, EnemyDef>>;
