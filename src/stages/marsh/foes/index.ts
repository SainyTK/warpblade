import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { mire } from "../../../game/enemies/kinds/mire";
import type { StageFoeType } from "../../../types/enemy";

export const MARSH_KINDS = {
  bogleech: mire,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
