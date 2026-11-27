import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { BlightFoe } from "./ids";
import { rotcrawler } from "./rotcrawler/kind";
import { spitbloom } from "./spitbloom/kind";
import { sporeheart } from "./sporeheart/kind";
import { sporepuff } from "./sporepuff/kind";

export const BLIGHT_KINDS = {
  rotcrawler,
  sporepuff,
  spitbloom,
  sporeheart,
} satisfies Record<BlightFoe, EnemyKind>;
