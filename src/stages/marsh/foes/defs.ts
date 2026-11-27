import type { EnemyDef } from "../../../constants/enemies";
import type { MarshFoe } from "./ids";

export const MARSH_DEFS = {
  bogleech: { rank: "minion", hp: 58, xp: 12, weight: 0.4, launchable: true, name: "Bog Leech" },
} satisfies Record<MarshFoe, EnemyDef>;
