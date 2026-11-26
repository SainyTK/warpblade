import type { SpriteCanvas } from "../engine/sprite";
import type { Color } from "./color";
import type { DrillProfile } from "./drill";
import type { HeroKit } from "./kit";
import type { MoveDef } from "./move";
import type { SkillBehavior } from "./skillBehavior";
import type { TouchButtonAction } from "./touch";

/** a 13 by 13 pixel touch button face: its rows and the colour of each letter */
export interface IconArt {
  rows: readonly string[];
  colors: Readonly<Record<string, Color>>;
}

/**
 * The hero's own meter on the HUD, under stamina (a kit resource such as rounds in a chamber or a stance gauge). The
 * HUD draws one bar from it every frame the hero is in play; a hero without a resource leaves it out.
 */
export interface HeroMeter {
  /** two capitals shown before the bar, as HP, MP and ST are */
  label: string;
  /** the fill's colour, a CSS colour */
  tint: string;
  /** how full the bar is, 0 to 1 */
  share(): number;
  /** the bar is split into this many equal cells (rounds, charges); left out, one smooth bar */
  cells?(): number;
  /** the bar glows: the resource is full or its bonus is on */
  lit?(): boolean;
  /** the bar flashes: a press it could not pay for */
  flash?(): boolean;
  /** a short figure after the bar, such as "3/6"; left out, none */
  text?(): string;
}

/** how the touch controller draws one hero's buttons */
export interface HeroTouchLook {
  /** the face of a button, given the selected ability on I and the abilities the hero knows */
  art(action: TouchButtonAction, ability: string, known: readonly string[]): IconArt;
  /** the rim colour of the buttons that follow the selected ability (those whose text has no accent) */
  tint(ability: string): Color;
}

/**
 * One hero's code, registered in `src/heroes/index.ts` under the hero's id. Shared code reaches a hero only through
 * this and through its `CharacterDef`; a hero is built by filling both from its own folder.
 */
export interface HeroModule {
  kit: HeroKit;
  /** the hero's combo moves by id, played by the shared combo engine (src/game/hero/combo.ts) */
  moves: Readonly<Record<string, MoveDef>>;
  /** code of the skills that act on their own or answer events, by skill id (docs/skill-design.md) */
  skills: Readonly<Record<string, SkillBehavior>>;
  /** the ultimate on U lets loose at this charge level, 1 to 4 */
  castUltimate(level: number): void;
  /** every icon the hero brings, 16 by 16: one per skill id, `<id>_evo` for evolved forms, and its source icons */
  icons: Readonly<Record<string, (s: SpriteCanvas) => void>>;
  touch: HeroTouchLook;
  meter?: HeroMeter;
  drill?: DrillProfile;
}
