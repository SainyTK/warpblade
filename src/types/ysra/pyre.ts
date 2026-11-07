/** Ysra's fire rites, called with I and paid with Heat */
export type RiteId = "flare" | "cinderLash" | "flamePillar" | "brazier" | "overheat";

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
  /** the standing column burns foes in it for this multiple of ability power every quarter second */
  column?: number;
  /** the sigil draws foes this many pixels away toward it before the burst */
  pull?: number;
}

/** a rite as the HUD, the controls and the cast read it */
export interface RiteDef {
  id: RiteId;
  /** the name on the skill node */
  name: string;
  /** the word on the HUD tab */
  tab: string;
  /** the skill that teaches it; none for a rite of her base kit */
  skill?: string;
  /** Heat it spends before its skill's level and Kindling change it; Overheat's is the least it needs */
  cost: number;
  /** the rite's colour on its tab and its touch button */
  tint: string;
}
