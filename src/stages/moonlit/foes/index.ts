import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { MoonlitFoe } from "./ids";
import { lanternshade } from "./lanternshade";

export const MOONLIT_KINDS = {
  lanternshade,
} satisfies Record<MoonlitFoe, EnemyKind>;
