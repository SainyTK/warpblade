import type { HeroColors } from "../constants/palette";
import type { Achievement } from "./achievement";
import type { HeroSource } from "./build";
import type { Color, Ramp } from "./color";
import type { InputAction } from "./input";
import type { JobDef } from "./job";
import type { ActionClip } from "./pose";
import type { BladeLook, OffhandLook, RigExtra, RigParts } from "./rig";
import type { SkillDef } from "./skill";
import type { Stats } from "./stats";
import type { StickDirectionSpec, TouchButtonAction, TouchButtonText } from "./touch";

/** how a hero looks on the shared rig: colours, head rows, the sword, and the hero's own parts */
export interface HeroSkin {
  colors: HeroColors;
  /**
   * 24 by 22 image pixel rows facing right, and the back of the head for a spin: D d h H W hair deep to glint,
   * L s S m skin light to deep, w I P eye white, iris and pupil, r a streak in the scarf's light colour,
   * K k c C the coat colours deep to light (a hood, a hat), v V the scarf colours (a lining, a band)
   */
  head: readonly string[];
  headBack: readonly string[];
  /** the sword in the near hand */
  blade: BladeLook;
  bladeDisplay?: (state: number) => "drawn" | "sheathed" | "heldSheathed";
  /** an item in the far hand or at the hip: a shield, a short sword, a scabbard */
  offhand?: OffhandLook;
  /** the hero's own drawing of a shared rig part, in place of the shared one */
  parts?: Partial<RigParts>;
  /** pieces the shared parts do not have, each drawn at its layer */
  extras?: readonly RigExtra[];
  /** where the scarf's rope hangs from: the neck, or the belt for a sash; left out, the neck */
  scarfAt?: "neck" | "belt";
  /** slashes, floor rings, afterimages and sparks, dark to bright, seven steps */
  ramp: Ramp;
  glow: Color;
  /** the sparks thrown where a blow lands, white to dark, four steps */
  sparks: Ramp;
}

/** a hero's keyed clips: the actions its moves and states play, and its own versions of the shared states */
export interface HeroClips {
  /** action clips by the hero's own names: each combo move's `clip` names one of these */
  actions: Readonly<Record<string, ActionClip>>;
  /** the hero at rest: its first frame is the stand on the hero screen; left out, the shared stand */
  idle?: ActionClip;
}

/** how the Controls screen and the touch controller describe one hero */
export interface HeroControls {
  /** what each action does for this hero, over the shared lines (`SHARED_ACTION_TEXT`) */
  actions: Partial<Record<InputAction, string>>;
  /** each touch button's label, hint and rim colour, over the shared ones (`SHARED_TOUCH_TEXT`) */
  touch: Partial<Record<TouchButtonAction, TouchButtonText>>;
  /** the stick's directions as the Controls screen lists them; left out, the shared list */
  stick?: readonly StickDirectionSpec[];
}

/** the ultimate a hero holds on U for the whole run */
export interface SpecialDef {
  id: string;
  /** as the hero screen writes it; the HUD shows it in capitals */
  name: string;
}

/**
 * One hero as data: everything the menus, the stores and the shared rig read without running the hero's code. The
 * hero's code (kit, moves, skills, icons) is its `HeroModule`, registered in `src/heroes/index.ts` under the same id.
 * This file and everything it imports must stay free of game state, so it may import constants, types, utils and the
 * engine only.
 */
export interface CharacterDef {
  id: string;
  name: string;
  /** shown under the name on the hero screen */
  title: string;
  blurb: string;
  /** the hero's colour in the menus, as a CSS colour: the frame and the stat bars on the hero screen */
  accent: string;
  /** coins to unlock the hero on the hero screen; 0 for a hero open from the start */
  price: number;
  special: SpecialDef;
  base: Stats;
  /** the hero's 20 skills (docs/skill-design.md) */
  skills: readonly SkillDef[];
  /** blows in the ground string for the whole run */
  comboHits: number;
  skin: HeroSkin;
  clips: HeroClips;
  controls: HeroControls;
  /** the hero's own achievements; the trial for clearing wave 10 is added for every hero */
  achievements: readonly Achievement[];
  /** the icon id of each of the hero's own damage sources on the end of run screen */
  sourceIcons: Readonly<Record<HeroSource, string>>;
  /** the name of the hero's own job on the hero screen's job row; read only for a hero with `jobs` */
  baseJob?: string;
  /** the jobs the hero can grow into besides their own (docs/hero-module.md, Jobs); left out, the hero has one job */
  jobs?: readonly JobDef[];
}
