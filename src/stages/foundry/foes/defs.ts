import type { EnemyDef } from "../../../constants/enemies";
import type { FoundryFoe } from "./ids";

export const FOUNDRY_DEFS = {
  coalmite: { rank: "minion", hp: 20, xp: 5, weight: 0.2, launchable: true, name: "Coalmite" },
  sparkfly: { rank: "minion", hp: 14, xp: 4, weight: 0, launchable: true, name: "Sparkfly" },
  slagling: { rank: "minion", hp: 66, xp: 13, weight: 0.45, launchable: true, name: "Slagling" },
  emberbat: { rank: "minion", hp: 32, xp: 9, weight: 0, launchable: true, name: "Ember Bat" },
  forgeguard: { rank: "minion", hp: 120, xp: 22, weight: 0.7, launchable: true, name: "Forgeguard" },
  bellowhound: { rank: "minion", hp: 140, xp: 14, weight: 0.55, launchable: true, name: "Bellows Hound" },
  crucibledrone: { rank: "minion", hp: 90, xp: 18, weight: 0, launchable: true, name: "Crucible Drone" },
  anvilhulk: { rank: "minion", hp: 220, xp: 22, weight: 0.85, launchable: false, name: "Anvil Hulk" },
  cinderdrake: { rank: "minion", hp: 130, xp: 26, weight: 0.2, launchable: true, name: "Cinder Drake" },
  slagtitan: { rank: "minion", hp: 320, xp: 30, weight: 0.95, launchable: false, name: "Slag Titan" },
  cindersmith: { rank: "boss", hp: 500, xp: 240, weight: 0.95, launchable: false, name: "The Cinder Smith" },
} satisfies Record<FoundryFoe, EnemyDef>;
