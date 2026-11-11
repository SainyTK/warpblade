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
   * L s S m skin light to deep, w I P eye white, iris and pupil, r a streak in the scarf's light colour,
   * K k c C a hood in the coat colours deep to light, v V its lining in the scarf colours
   */
  head: readonly string[];
  headBack: readonly string[];
  weapon: "sword" | "glaive" | "crossbow" | "gauntlets" | "chain" | "staff" | "lampPole" | "knives" | "mallets";
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
  /** the hair is gathered in a low bun held by two pins in the trim colours, with no ponytail and no scarf streamer */
  bun?: boolean;
  /** a hood drawn in the head rows covers the hair: its point hangs from the back of the head, with no ponytail or scarf */
  hood?: boolean;
  /** under a hood, a short scarf end still trails from the neck along the scarf's rope */
  scarfEnd?: boolean;
  /** the coat tails hang long as a cloak, lined in the scarf colours, with drips of the trim colour along the hem */
  cloak?: boolean;
  /** a leather satchel at the front of the hip in the glove colours, three candle tips in the trim colours showing */
  satchel?: boolean;
  /** cloth bands wound round the shins over the boots */
  wraps?: boolean;
  /** a headband in the scarf colours: its two short ends trail along the ponytail's rope, with no ponytail, and the
   *  scarf's rope hangs from the belt as a sash */
  headband?: boolean;
  /** a war drum on a strap across the chest, worn at the hip and swung to the front by the pose's `dr` */
  drum?: boolean;
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
