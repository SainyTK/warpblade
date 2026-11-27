import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { galehawk } from "./galehawk/kind";
import type { SkywayFoe } from "./ids";
import { skyguard } from "./skyguard/kind";
import { sparkjelly } from "./sparkjelly/kind";
import { tempestroc } from "./tempestroc/kind";

export const SKYWAY_KINDS = {
  galehawk,
  sparkjelly,
  skyguard,
  tempestroc,
} satisfies Record<SkywayFoe, EnemyKind>;
