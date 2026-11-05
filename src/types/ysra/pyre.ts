import type { YsraPerk } from "./index";

/** Ysra's fire rites, called with I and paid with Heat */
export type RiteId = "flare" | "flamePillar" | "brazier";

/** the shape of one Flame Pillar: its base values, or an evolved or flanking pillar's */
export interface PillarShape {
  /** damage as a multiple of ability power */
  power: number;
  height: number;
  halfWidth: number;
  launch: number;
  /** seconds the sigil glows on the floor before the pillar bursts */
  warn: number;
  /** seconds the pillar stands */
  stand: number;
  /** the sigil's size as a share of the base sigil */
  sigil: number;
  /** an outer ring around the sigil, so an evolved cast reads before it bursts */
  ring: boolean;
  shake: number;
  amp: number;
  hitStop: number;
}

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
