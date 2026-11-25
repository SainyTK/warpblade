import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { husk } from "../../../game/enemies/kinds/night";
import { oakheart } from "../../../game/enemies/kinds/oakheart";
import { sprite } from "../../../game/enemies/kinds/sprite";
import { stalker } from "../../../game/enemies/kinds/stalker";
import type { StageFoeType } from "../../../types/enemy";

export const GLACIER_KINDS = {
  rimehound: stalker,
  shardling: sprite,
  cryomancer: husk,
  rimeclaw: oakheart,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
