import type { EnemyDef } from "../../../constants/enemies";
import type { SkywayFoe } from "./ids";

export const SKYWAY_DEFS = {
  galehawk: { rank: "minion", hp: 36, xp: 10, weight: 0, launchable: true, name: "Gale Hawk" },
  sparkjelly: { rank: "minion", hp: 44, xp: 11, weight: 0, launchable: true, name: "Spark Jelly" },
  skyguard: { rank: "minion", hp: 96, xp: 18, weight: 0.55, launchable: true, name: "Sky Guard" },
  tempestroc: { rank: "boss", hp: 860, xp: 240, weight: 0.95, launchable: false, name: "Tempest Roc" },
} satisfies Record<SkywayFoe, EnemyDef>;
