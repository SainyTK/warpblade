import type { EnemyDef } from "../../../constants/enemies";
import type { CitadelFoe } from "./ids";

export const CITADEL_DEFS = {
  umbramite: { rank: "minion", hp: 20, xp: 5, weight: 0.1, launchable: true, name: "Umbra Mite" },
  riftmote: { rank: "minion", hp: 14, xp: 4, weight: 0, launchable: true, name: "Rift Mote" },
  hollowsquire: { rank: "minion", hp: 80, xp: 11, weight: 0.5, launchable: true, name: "Hollow Squire" },
  riftray: { rank: "minion", hp: 60, xp: 14, weight: 0, launchable: true, name: "Rift Ray" },
  eclipseknight: { rank: "minion", hp: 140, xp: 18, weight: 0.8, launchable: false, name: "Eclipse Knight" },
  duskseraph: { rank: "minion", hp: 90, xp: 21, weight: 0.1, launchable: true, name: "Dusk Seraph" },
  voidbehemoth: { rank: "minion", hp: 220, xp: 25, weight: 0.92, launchable: false, name: "Void Behemoth" },
  voidheadsman: { rank: "minion", hp: 260, xp: 30, weight: 0.95, launchable: false, name: "Void Headsman" },
} satisfies Record<CitadelFoe, EnemyDef>;
