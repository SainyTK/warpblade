import { boghulk } from "../../../game/enemies/kinds/boghulk";
import { golem } from "../../../game/enemies/kinds/golem";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { moth } from "../../../game/enemies/kinds/moth";
import { thornback } from "../../../game/enemies/kinds/thornback";
import type { StageFoeType } from "../../../types/enemy";

export const FOUNDRY_KINDS = {
  slagling: thornback,
  emberbat: moth,
  forgeguard: golem,
  cindersmith: boghulk,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
