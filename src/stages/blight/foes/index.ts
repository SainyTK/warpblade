import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { StageFoeType } from "../../../types/enemy";
import { rotcrawler } from "./rotcrawler/kind";
import { spitbloom } from "./spitbloom/kind";
import { sporeheart } from "./sporeheart/kind";
import { sporepuff } from "./sporepuff/kind";

export const BLIGHT_KINDS = {
  rotcrawler,
  sporepuff,
  spitbloom,
  sporeheart,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
