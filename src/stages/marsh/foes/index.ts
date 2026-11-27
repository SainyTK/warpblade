import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { bogleech } from "./bogleech";
import type { MarshFoe } from "./ids";

export const MARSH_KINDS = {
  bogleech,
} satisfies Record<MarshFoe, EnemyKind>;
