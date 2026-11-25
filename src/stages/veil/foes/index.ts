import { golem } from "../../../game/enemies/kinds/golem";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";

export const VEIL_KINDS = {
  riftknight: golem,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
