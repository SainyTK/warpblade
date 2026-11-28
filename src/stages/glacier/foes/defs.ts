import type { EnemyDef } from "../../../constants/enemies";
import type { GlacierFoe } from "./ids";

export const GLACIER_DEFS = {
  frostmite: { rank: "minion", hp: 10, xp: 5, weight: 0.1, launchable: true, name: "Frost Mite" },
  snowflit: { rank: "minion", hp: 6, xp: 4, weight: 0, launchable: true, name: "Snowflit" },
  rimehound: { rank: "minion", hp: 54, xp: 13, weight: 0.35, launchable: true, name: "Rime Hound" },
  shardling: { rank: "minion", hp: 30, xp: 9, weight: 0, launchable: true, name: "Shardling" },
  cryomancer: { rank: "minion", hp: 78, xp: 18, weight: 0.55, launchable: true, name: "Cryomancer" },
  hoarback: { rank: "minion", hp: 96, xp: 14, weight: 0.6, launchable: true, name: "Hoarback" },
  hoarwraith: { rank: "minion", hp: 60, xp: 18, weight: 0.1, launchable: true, name: "Hoar Wraith" },
  rimetusk: { rank: "minion", hp: 140, xp: 22, weight: 0.8, launchable: false, name: "Rimetusk" },
  frostbell: { rank: "minion", hp: 80, xp: 26, weight: 0.3, launchable: true, name: "Frost Bell" },
  frostcolossus: { rank: "minion", hp: 200, xp: 30, weight: 0.95, launchable: false, name: "Permafrost Colossus" },
  rimeclaw: { rank: "boss", hp: 880, xp: 240, weight: 0.95, launchable: false, name: "Rimeclaw" },
} satisfies Record<GlacierFoe, EnemyDef>;
