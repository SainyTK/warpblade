import type { Color } from "../../../types/color";
import { hex } from "../../../utils/color";
import type { VesperAbility } from "../types/ability";

/** Vesper's abilities on I in the order O turns through them: the two base abilities, then the spells her skills teach */
export const VESPER_ABILITIES: readonly VesperAbility[] = ["crescent", "stitch", "moon", "gale", "thread"];
/** the skill that teaches each spell */
export const SPELL_SKILL: Readonly<Record<Exclude<VesperAbility, "crescent" | "stitch">, string>> = {
  moon: "ve_moon",
  gale: "ve_gale",
  thread: "ve_thread",
};
/** MP each ability costs, and the wide form's share more */
export const ABILITY_COST: Readonly<Record<VesperAbility, number>> = {
  crescent: 10,
  stitch: 12,
  moon: 16,
  gale: 14,
  thread: 12,
};
export const WIDE_COST = 1.5;
/** seconds before a base ability can be cast again; a spell takes its own from its skill's level */
export const BASE_RECHARGE = { crescent: 3.5, stitch: 5 } as const;
export const SPELL_RECHARGE = 4;
/** her cancel rule: I after a blow of the string has landed casts at once, and the string goes on after it */
export const WEAVE = { link: 0.35 } as const;
/** Twin Crescent: two waves that cross ahead of her, each cutting a foe once, ability power each; held, four */
export const CRESCENT = { power: 1.3, speed: 240, life: 0.55, cross: 38, spread: 10, wideRise: 0.35 } as const;
/** Stitch: she darts to each foe in reach in turn, cutting it, and comes back to where she started; held, wider and more */
export const STITCH = { power: 1.1, reach: 72, most: 3, wideReach: 110, wideMost: 5, leg: 0.06, back: 0.08 } as const;
/** each ability's colour: the HUD tab, the touch rim and the light at her hands */
export const ABILITY_COLOR: Readonly<Record<VesperAbility, Color>> = {
  crescent: hex("#b8a0ff"),
  stitch: hex("#e6dcff"),
  moon: hex("#f0e6ff"),
  gale: hex("#9ab8ff"),
  thread: hex("#d890ff"),
};
