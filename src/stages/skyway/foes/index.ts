import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { cloudwyrm } from "./cloudwyrm/kind";
import { galehawk } from "./galehawk/kind";
import { galeram } from "./galeram/kind";
import type { SkywayFoe } from "./ids";
import { lanternwarden } from "./lanternwarden/kind";
import { nimbit } from "./nimbit/kind";
import { skyguard } from "./skyguard/kind";
import { sparkjelly } from "./sparkjelly/kind";
import { squallfinch } from "./squallfinch/kind";
import { stormcolossus } from "./stormcolossus/kind";
import { tempestroc } from "./tempestroc/kind";
import { zephyray } from "./zephyray/kind";

export const SKYWAY_KINDS = {
  nimbit,
  squallfinch,
  galehawk,
  sparkjelly,
  skyguard,
  galeram,
  zephyray,
  lanternwarden,
  cloudwyrm,
  stormcolossus,
  tempestroc,
} satisfies Record<SkywayFoe, EnemyKind>;
