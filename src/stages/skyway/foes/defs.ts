import type { EnemyDef } from "../../../constants/enemies";
import type { SkywayFoe } from "./ids";

export const SKYWAY_DEFS = {
  nimbit: { rank: "minion", hp: 10, xp: 4, weight: 0, launchable: true, name: "Nimbit" },
  squallfinch: { rank: "minion", hp: 8, xp: 5, weight: 0, launchable: true, name: "Squall Finch" },
  galehawk: { rank: "minion", hp: 36, xp: 10, weight: 0, launchable: true, name: "Gale Hawk" },
  sparkjelly: { rank: "minion", hp: 44, xp: 11, weight: 0, launchable: true, name: "Spark Jelly" },
  skyguard: { rank: "minion", hp: 96, xp: 18, weight: 0.55, launchable: true, name: "Sky Guard" },
  galeram: { rank: "minion", hp: 110, xp: 14, weight: 0.6, launchable: true, name: "Gale Ram" },
  zephyray: { rank: "minion", hp: 70, xp: 18, weight: 0.2, launchable: true, name: "Zephyr Ray" },
  lanternwarden: { rank: "minion", hp: 150, xp: 22, weight: 0.75, launchable: true, name: "Lantern Warden" },
  cloudwyrm: { rank: "minion", hp: 120, xp: 26, weight: 0.5, launchable: true, name: "Cloud Wyrm" },
  stormcolossus: { rank: "minion", hp: 220, xp: 30, weight: 0.9, launchable: false, name: "Storm Colossus" },
  tempestroc: { rank: "boss", hp: 860, xp: 240, weight: 0.95, launchable: false, name: "Tempest Roc" },
} satisfies Record<SkywayFoe, EnemyDef>;
