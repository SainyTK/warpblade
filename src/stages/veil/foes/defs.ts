import type { EnemyDef } from "../../../constants/enemies";
import type { VeilFoe } from "./ids";

export const VEIL_DEFS = {
  riftknight: { rank: "minion", hp: 110, xp: 20, weight: 0.7, launchable: true, name: "Rift Knight" },
} satisfies Record<VeilFoe, EnemyDef>;
