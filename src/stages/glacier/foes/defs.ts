import type { EnemyDef } from "../../../constants/enemies";
import type { GlacierFoe } from "./ids";

export const GLACIER_DEFS = {
  rimehound: { rank: "minion", hp: 54, xp: 13, weight: 0.35, launchable: true, name: "Rime Hound" },
  shardling: { rank: "minion", hp: 30, xp: 9, weight: 0, launchable: true, name: "Shardling" },
  cryomancer: { rank: "minion", hp: 78, xp: 18, weight: 0.55, launchable: true, name: "Cryomancer" },
  rimeclaw: { rank: "boss", hp: 880, xp: 240, weight: 0.95, launchable: false, name: "Rimeclaw" },
} satisfies Record<GlacierFoe, EnemyDef>;
