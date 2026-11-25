import { golem } from "../../../game/enemies/kinds/golem";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { wisp } from "../../../game/enemies/kinds/night";
import { shepherd } from "../../../game/enemies/kinds/shepherd";
import { stalker } from "../../../game/enemies/kinds/stalker";
import type { StageFoeType } from "../../../types/enemy";

export const ARCHIVE_KINDS = {
  inkling: stalker,
  pagewing: wisp,
  tomeguard: golem,
  pagewyrm: shepherd,
} satisfies Partial<Record<StageFoeType, EnemyKind>>;
