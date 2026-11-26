import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { riftknight } from "./riftknight";

export const VEIL_KINDS = {
  riftknight,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
