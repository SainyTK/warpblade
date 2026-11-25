import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { lanternshade } from "./lanternshade";

export const MOONLIT_KINDS = {
  lanternshade,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
