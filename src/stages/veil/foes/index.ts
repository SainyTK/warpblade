import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { VeilFoe } from "./ids";
import { riftknight } from "./riftknight";

export const VEIL_KINDS = {
  riftknight,
} satisfies Record<VeilFoe, EnemyKind>;
