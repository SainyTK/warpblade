import type { EnemyDef } from "../../../constants/enemies";
import type { StageFoeType } from "../../../types/enemy";

export const FOUNDRY_DEFS = {
  slagling: { rank: "minion", hp: 66, xp: 13, weight: 0.45, launchable: true, name: "Slagling" },
  emberbat: { rank: "minion", hp: 32, xp: 9, weight: 0, launchable: true, name: "Ember Bat" },
  forgeguard: { rank: "minion", hp: 120, xp: 22, weight: 0.7, launchable: true, name: "Forgeguard" },
  cindersmith: { rank: "boss", hp: 900, xp: 240, weight: 0.95, launchable: false, name: "The Cinder Smith" },
} satisfies Partial<Record<StageFoeType, EnemyDef>>;
