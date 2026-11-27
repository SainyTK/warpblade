import type { EnemyDef } from "../../../constants/enemies";
import type { MoonlitFoe } from "./ids";

export const MOONLIT_DEFS = {
  rattleskull: { rank: "minion", hp: 10, xp: 5, weight: 0, launchable: true, name: "Rattle Skull" },
  wickling: { rank: "minion", hp: 6, xp: 4, weight: 0, launchable: true, name: "Wickling" },
  lanternshade: { rank: "minion", hp: 40, xp: 10, weight: 0, launchable: true, name: "Lantern Shade" },
  gravedigger: { rank: "minion", hp: 90, xp: 14, weight: 0.5, launchable: true, name: "Gravedigger" },
  keenwraith: { rank: "minion", hp: 60, xp: 18, weight: 0, launchable: true, name: "Keening Wraith" },
  barrowhound: { rank: "minion", hp: 120, xp: 21, weight: 0.4, launchable: true, name: "Barrow Hound" },
  tollbell: { rank: "minion", hp: 80, xp: 26, weight: 0.3, launchable: true, name: "Toll Bell" },
  barrowlord: { rank: "minion", hp: 200, xp: 30, weight: 0.85, launchable: false, name: "Barrow Lord" },
} satisfies Record<MoonlitFoe, EnemyDef>;
