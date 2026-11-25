import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { maw } from "../../../game/enemies/kinds/maw";
import { mire } from "../../../game/enemies/kinds/mire";
import { moth } from "../../../game/enemies/kinds/moth";
import { thornback } from "../../../game/enemies/kinds/thornback";
import type { StageFoeType } from "../../../types/enemy";

export const BLIGHT_KINDS = {
  rotcrawler: mire,
  sporepuff: moth,
  spitbloom: thornback,
  sporeheart: maw,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
