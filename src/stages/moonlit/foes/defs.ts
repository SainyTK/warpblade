import type { EnemyDef } from "../../../constants/enemies";
import type { MoonlitFoe } from "./ids";

export const MOONLIT_DEFS = {
  lanternshade: { rank: "minion", hp: 40, xp: 10, weight: 0, launchable: true, name: "Lantern Shade" },
} satisfies Record<MoonlitFoe, EnemyDef>;
