import type { EnemyDef } from "../../../constants/enemies";
import type { MarshFoe } from "./ids";

export const MARSH_DEFS = {
  bogleech: { rank: "minion", hp: 58, xp: 12, weight: 0.4, launchable: true, name: "Bog Leech" },
  bogling: { rank: "minion", hp: 10, xp: 5, weight: 0.1, launchable: true, name: "Bogling" },
  fenmidge: { rank: "minion", hp: 8, xp: 4, weight: 0, launchable: true, name: "Fen Midge" },
  mossback: { rank: "minion", hp: 90, xp: 14, weight: 0.75, launchable: true, name: "Mossback Snapper" },
  voltfly: { rank: "minion", hp: 50, xp: 18, weight: 0, launchable: true, name: "Volt Dragonfly" },
  reedseer: { rank: "minion", hp: 96, xp: 22, weight: 0.45, launchable: true, name: "Reed Seer" },
  thunderray: { rank: "minion", hp: 70, xp: 26, weight: 0.3, launchable: true, name: "Thunder Ray" },
  stormgator: { rank: "minion", hp: 140, xp: 30, weight: 0.85, launchable: false, name: "Stormgator" },
} satisfies Record<MarshFoe, EnemyDef>;
