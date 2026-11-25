import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { wisp } from "../../../game/enemies/kinds/night";
import type { StageFoeType } from "../../../types/enemy";

export const MOONLIT_KINDS = {
  lanternshade: wisp,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
