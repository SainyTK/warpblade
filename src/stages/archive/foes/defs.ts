import type { EnemyDef } from "../../../constants/enemies";
import type { ArchiveFoe } from "./ids";

export const ARCHIVE_DEFS = {
  bookmite: { rank: "minion", hp: 10, xp: 5, weight: 0, launchable: true, name: "Bookmite" },
  blotmoth: { rank: "minion", hp: 8, xp: 4, weight: 0, launchable: true, name: "Blot Moth" },
  inkling: { rank: "minion", hp: 62, xp: 13, weight: 0.4, launchable: true, name: "Inkling" },
  pagewing: { rank: "minion", hp: 32, xp: 9, weight: 0, launchable: true, name: "Pagewing" },
  tomeguard: { rank: "minion", hp: 110, xp: 20, weight: 0.7, launchable: true, name: "Tomeguard" },
  quillshrike: { rank: "minion", hp: 150, xp: 14, weight: 0.1, launchable: true, name: "Quillshrike" },
  scrivener: { rank: "minion", hp: 180, xp: 18, weight: 0.5, launchable: true, name: "Scrivener" },
  foliant: { rank: "minion", hp: 320, xp: 22, weight: 0.85, launchable: false, name: "Foliant" },
  wardlamp: { rank: "minion", hp: 200, xp: 26, weight: 0.3, launchable: true, name: "Warding Lamp" },
  hushwarden: { rank: "minion", hp: 420, xp: 30, weight: 0.8, launchable: false, name: "Hushwarden" },
  pagewyrm: { rank: "boss", hp: 900, xp: 240, weight: 0.95, launchable: false, name: "The Pagewyrm" },
} satisfies Record<ArchiveFoe, EnemyDef>;
