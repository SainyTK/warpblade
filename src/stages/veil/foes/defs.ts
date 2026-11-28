import type { EnemyDef } from "../../../constants/enemies";
import type { VeilFoe } from "./ids";

export const VEIL_DEFS = {
  glintmite: { rank: "minion", hp: 10, xp: 5, weight: 0, launchable: true, name: "Glintmite" },
  glimmerwing: { rank: "minion", hp: 8, xp: 4, weight: 0, launchable: true, name: "Glimmerwing" },
  riftknight: { rank: "minion", hp: 110, xp: 20, weight: 0.7, launchable: true, name: "Rift Knight" },
  shardram: { rank: "minion", hp: 120, xp: 14, weight: 0.6, launchable: true, name: "Shard Ram" },
  auroraray: { rank: "minion", hp: 90, xp: 18, weight: 0.1, launchable: true, name: "Aurora Ray" },
  runebinder: { rank: "minion", hp: 140, xp: 22, weight: 0.5, launchable: true, name: "Rune Binder" },
  facetseer: { rank: "minion", hp: 120, xp: 26, weight: 0.3, launchable: true, name: "Facet Seer" },
  spirecolossus: { rank: "minion", hp: 260, xp: 30, weight: 0.95, launchable: false, name: "Spire Colossus" },
} satisfies Record<VeilFoe, EnemyDef>;
