import { eye } from "../../../game/enemies/kinds/eye";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { husk, warden } from "../../../game/enemies/kinds/night";
import { stormkite } from "../../../game/enemies/kinds/stormkite";
import type { StageFoeType } from "../../../types/enemy";

export const SKYWAY_KINDS = {
  galehawk: stormkite,
  sparkjelly: eye,
  skyguard: husk,
  tempestroc: warden,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
