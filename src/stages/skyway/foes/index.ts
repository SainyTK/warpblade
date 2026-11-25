import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { galehawk } from "./galehawk/kind";
import { skyguard } from "./skyguard/kind";
import { sparkjelly } from "./sparkjelly/kind";
import { tempestroc } from "./tempestroc/kind";

export const SKYWAY_KINDS = {
  galehawk,
  sparkjelly,
  skyguard,
  tempestroc,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
