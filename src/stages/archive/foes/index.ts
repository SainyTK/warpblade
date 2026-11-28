import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { blotmoth } from "./blotmoth/kind";
import { bookmite } from "./bookmite/kind";
import { foliant } from "./foliant/kind";
import { hushwarden } from "./hushwarden/kind";
import type { ArchiveFoe } from "./ids";
import { inkling } from "./inkling/kind";
import { pagewing } from "./pagewing/kind";
import { pagewyrm } from "./pagewyrm/kind";
import { quillshrike } from "./quillshrike/kind";
import { scrivener } from "./scrivener/kind";
import { tomeguard } from "./tomeguard/kind";
import { wardlamp } from "./wardlamp/kind";

export const ARCHIVE_KINDS = {
  bookmite,
  blotmoth,
  inkling,
  pagewing,
  tomeguard,
  quillshrike,
  scrivener,
  foliant,
  wardlamp,
  hushwarden,
  pagewyrm,
} satisfies Record<ArchiveFoe, EnemyKind>;
