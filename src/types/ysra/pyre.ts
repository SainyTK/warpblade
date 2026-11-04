import type { YsraPerk } from "./index";

/** Ysra's fire rites, called with I and paid with Heat */
export type RiteId = "flare" | "flamePillar" | "brazier";

/** a rite as the HUD, the controls and the cast read it */
export interface RiteDef {
  id: RiteId;
  /** the name on the skill node */
  name: string;
  /** the word on the HUD tab */
  tab: string;
  /** the skill that teaches it */
  perk: YsraPerk;
  /** Heat it spends before Hearthfire */
  cost: number;
  /** the rite's colour on its tab and its touch button */
  tint: string;
}
