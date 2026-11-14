import type { YunAbility } from "../types/ability";
import { SKILL } from "./skillIds";

/** Yun's abilities on I, in the order O turns through them */
export const YUN_ABILITIES: readonly YunAbility[] = ["stream", "lotus", "fan", "cage", "crescent"];
/** the skill that teaches each ability beyond the two he starts with */
export const ABILITY_SKILL: Readonly<Partial<Record<YunAbility, string>>> = {
  fan: SKILL.fan,
  cage: SKILL.cage,
  crescent: SKILL.crescent,
};
/** seconds before each base ability can be cast again; the others take theirs from their skill's level */
export const RECHARGE: Readonly<Record<YunAbility, number>> = {
  stream: 1.2,
  lotus: 3.5,
  fan: 2,
  cage: 3,
  crescent: 2.5,
};
/** spirit swords an ability needs at the least; it spends every sword held */
export const LEAST_SWORDS = 1;
/** Qi Crescent is paid with MP, not swords */
export const CRESCENT_COST = 14;

/**
 * Sword Stream: every held sword flies out along the line ahead `reach` pixels at `speed` and back to Yun, cutting each
 * foe once on the way out and once on the way back for `power` times ability power. Held: they fan out on the `rises`
 * (pixels climbed per pixel flown) and fly `wideReach`.
 */
export const STREAM = {
  reach: 150,
  wideReach: 210,
  speed: 420,
  power: 0.8,
  half: 6,
  gap: 0.04,
  rises: [0, -0.22, 0.14],
} as const;

/**
 * Sword Lotus: every held sword flies to a point `ahead` pixels in front and spins there in a ring of `radius` for
 * `life` seconds, each sword cutting the foes it passes every `every` seconds for `power` times ability power. Held:
 * the ring spins round Yun and follows him, `wideRadius` wide, for `wideLife`.
 */
export const LOTUS = {
  ahead: 44,
  height: -18,
  radius: 20,
  wideRadius: 27,
  life: 2.4,
  wideLife: 3,
  every: 0.35,
  power: 0.3,
  spin: 7,
  touch: 9,
} as const;

/** Sword Fan: the climb of each sword in the fan, a pixel flown, top to bottom; held, the fan opens wider */
export const FAN = { rises: [-0.7, -0.35, 0, 0.3, 0.55, -0.55, 0.15, -0.15], wide: 1.4 } as const;
/** Sword Cage: how far ahead it looks for foes, and how far round the foe its swords fall from */
export const CAGE = { reach: 170, leans: [-26, 26, 0, -14, 14] } as const;
/** Qi Crescent: its speed and half height; held, it runs both ways */
export const CRESCENT = { speed: 300, half: 11 } as const;

/** the colour each ability's HUD tab lights in */
export const ABILITY_TINT: Readonly<Record<YunAbility, string>> = {
  stream: "#5fd6a4",
  lotus: "#9af0c8",
  fan: "#7ee6b8",
  cage: "#3fc493",
  crescent: "#dcfff0",
};
