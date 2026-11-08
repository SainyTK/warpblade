import type { HeroColors } from "../constants/palette";
import type { Color, Ramp } from "./color";
import type { KitId } from "./kit";
import type { SkillDef, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** how a hero looks on the shared rig: colours, head rows, weapon and the light of their blows */
export interface HeroSkin {
  colors: HeroColors;
  /**
   * 24 by 22 image pixel rows facing right, and the back of the head for a spin: D d h H W hair deep to glint,
   * L s S m skin light to deep, w I P eye white, iris and pupil, r a streak in the scarf's light colour
   */
  head: readonly string[];
  headBack: readonly string[];
  weapon: "sword" | "glaive" | "crossbow" | "gauntlets" | "chain";
  /** from the hand to the tip, in pixels */
  reach: number;
  /** slashes, floor rings, afterimages and sparks, dark to bright, seven steps */
  ramp: Ramp;
  glow: Color;
  /** the sparks thrown where a blow lands, white to dark, four steps */
  sparks: Ramp;
  /** one heavy braid in the hair colours hangs where the scarf and ponytail would */
  braid?: boolean;
  /** bare arms in the skin colours with wrapped wrists, in place of coat sleeves and bracers */
  bareArms?: boolean;
  /** the scarf's rope hangs from the belt as a sash, in place of the neck */
  sash?: boolean;
}

export interface CharacterDef {
  id: string;
  /** whose controls, moves and states this hero plays with */
  kit: KitId;
  name: string;
  /** shown under the name on the hero screen */
  title: string;
  blurb: string;
  /** the hero's colour in the menus, as a CSS colour: the frame and the stat bars on the hero screen */
  accent: string;
  /** the ultimate on U from the start of a run; an ultimate skill upgrades or replaces it */
  special: UltimateId;
  base: Stats;
  /** added per level after the first */
  growth: Partial<Stats>;
  /** the hero's 20 skills (docs/skill-design.md) */
  skills: readonly SkillDef[];
  /** blows in the ground string for the whole run */
  comboHits: number;
  skin: HeroSkin;
}
