import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import type { ArchiveFoe } from "./ids";
import { inkling } from "./inkling/kind";
import { pagewing } from "./pagewing/kind";
import { pagewyrm } from "./pagewyrm/kind";
import { tomeguard } from "./tomeguard/kind";

export const ARCHIVE_KINDS = {
  inkling,
  pagewing,
  tomeguard,
  pagewyrm,
} satisfies Record<ArchiveFoe, EnemyKind>;
