import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { bogleech } from "./bogleech";

export const MARSH_KINDS = {
  bogleech,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
