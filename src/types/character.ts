import type { HeroColors } from "../constants/palette";
import type { Color, Ramp } from "./color";
import type { KitId } from "./kit";
import type { SkillBranch, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** how a hero looks on the shared rig: colours, head rows, weapon and the light of their blows */
export interface HeroSkin {
  colors: HeroColors;
  /** 10 by 10 pixel rows facing right, and the back of the head for a spin; d h H hair, s S skin, E eye, r streak */
  head: readonly string[];
  headBack: readonly string[];
  weapon: "sword" | "glaive";
  /** from the hand to the tip, in pixels */
  reach: number;
  /** slashes, floor rings, afterimages and sparks, dark to bright, seven steps */
  ramp: Ramp;
  glow: Color;
  /** the sparks thrown where a blow lands, white to dark, four steps */
  sparks: Ramp;
}

export interface CharacterDef {
  id: string;
  /** whose controls, moves and states this hero plays with */
  kit: KitId;
  name: string;
  /** shown under the name on the hero screen */
  title: string;
  blurb: string;
  /** the weakest ultimate, learned like any other, and replaced by a stronger one */
  special: UltimateId;
  base: Stats;
  /** added per level after the first */
  growth: Partial<Stats>;
  branches: readonly SkillBranch[];
  /** skills already learned when a run starts */
  startRanks?: Readonly<Record<string, number>>;
  skin: HeroSkin;
}
