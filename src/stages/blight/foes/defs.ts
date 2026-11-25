import type { EnemyDef } from "../../../constants/enemies";
import type { StageFoeType } from "../../../types/enemy";

export const BLIGHT_DEFS = {
  rotcrawler: { rank: "minion", hp: 62, xp: 14, weight: 0.5, launchable: true, name: "Rot Crawler" },
  sporepuff: { rank: "minion", hp: 30, xp: 9, weight: 0, launchable: true, name: "Spore Puff" },
  spitbloom: { rank: "minion", hp: 66, xp: 16, weight: 1, launchable: false, name: "Spitbloom" },
  sporeheart: { rank: "boss", hp: 680, xp: 240, weight: 1, launchable: false, name: "Sporeheart" },
} satisfies Partial<Record<StageFoeType, EnemyDef>>;
