import type { EnemyDef } from "../../../constants/enemies";
import type { BlightFoe } from "./ids";

export const BLIGHT_DEFS = {
  moldmite: { rank: "minion", hp: 12, xp: 5, weight: 0, launchable: true, name: "Mold Mite" },
  sporegnat: { rank: "minion", hp: 8, xp: 4, weight: 0, launchable: true, name: "Spore Gnat" },
  rotcrawler: { rank: "minion", hp: 62, xp: 14, weight: 0.5, launchable: true, name: "Rot Crawler" },
  sporepuff: { rank: "minion", hp: 30, xp: 9, weight: 0, launchable: true, name: "Spore Puff" },
  spitbloom: { rank: "minion", hp: 66, xp: 16, weight: 1, launchable: false, name: "Spitbloom" },
  rotboar: { rank: "minion", hp: 96, xp: 14, weight: 0.7, launchable: true, name: "Rot Boar" },
  cordywasp: { rank: "minion", hp: 54, xp: 18, weight: 0, launchable: true, name: "Cordyceps Wasp" },
  hyphamancer: { rank: "minion", hp: 110, xp: 22, weight: 0.6, launchable: true, name: "Hyphamancer" },
  bloatcap: { rank: "minion", hp: 90, xp: 26, weight: 0.9, launchable: false, name: "Bloatcap" },
  rotbear: { rank: "minion", hp: 160, xp: 30, weight: 0.95, launchable: false, name: "Rotback Bear" },
  sporeheart: { rank: "boss", hp: 680, xp: 240, weight: 1, launchable: false, name: "Sporeheart" },
} satisfies Record<BlightFoe, EnemyDef>;
