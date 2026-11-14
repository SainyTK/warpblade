import type { SayaAbility } from "../types/ability";
import { SPELL } from "./spells";

/** her two base abilities' MP, recharge in seconds, tab label and the colour its tab lights in */
export const ABILITY = {
  line: { cost: 12, recharge: 3.5, label: "LINE", tint: "#dfe5ff" },
  rise: { cost: 14, recharge: 4.5, label: "RISE", tint: "#8fa2ff" },
} as const;

/** every ability's MP before the wide form, tab label and tab colour */
export const ABILITY_TAB: Readonly<Record<SayaAbility, { cost: number; label: string; tint: string }>> = {
  ...ABILITY,
  ...SPELL,
};

/** the order O turns through her abilities: Brushline, Moonrise, then the spells her skills teach */
export const ABILITY_ORDER: readonly SayaAbility[] = ["line", "rise", "crescent", "rain", "still"];

/** a wide form (I held) costs this many times the MP */
export const WIDE_COST = 1.5;

/**
 * Brushline: a dash of `length` px through the foes ahead with the blade drawn; each foe on the line takes `now` times
 * ability power at once and stores `store` times it for the click
 */
export const BRUSHLINE = { length: 44, now: 0.3, store: 2.4, kx: 30 } as const;

/**
 * Moonrise: she rises `lift` px as an ink wave runs `range` px up and ahead at `speed`; each foe it meets takes `now`
 * times ability power at once and is thrown up at `launch`, and stores `store` times it
 */
export const MOONRISE = { lift: 20, range: 92, speed: 300, now: 0.6, store: 1.6, launch: 250, height: 30 } as const;
