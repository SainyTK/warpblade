import type { EnemyDef } from "../../../constants/enemies";
import type { ArchiveFoe } from "./ids";

export const ARCHIVE_DEFS = {
  inkling: { rank: "minion", hp: 62, xp: 13, weight: 0.4, launchable: true, name: "Inkling" },
  pagewing: { rank: "minion", hp: 32, xp: 9, weight: 0, launchable: true, name: "Pagewing" },
  tomeguard: { rank: "minion", hp: 110, xp: 20, weight: 0.7, launchable: true, name: "Tomeguard" },
  pagewyrm: { rank: "boss", hp: 900, xp: 240, weight: 0.95, launchable: false, name: "The Pagewyrm" },
} satisfies Record<ArchiveFoe, EnemyDef>;
