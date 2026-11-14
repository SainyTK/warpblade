import type { YunAbility } from "../types/ability";

/** Yun's abilities on I, in the order O turns through them */
export const YUN_ABILITIES: readonly YunAbility[] = ["stream", "lotus"];
/** seconds before each can be cast again */
export const RECHARGE: Readonly<Record<YunAbility, number>> = { stream: 1.2, lotus: 3.5 };
/** spirit swords an ability needs at the least; it spends every sword held */
export const LEAST_SWORDS = 1;

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

/** the colour each ability's HUD tab lights in */
export const ABILITY_TINT: Readonly<Record<YunAbility, string>> = { stream: "#5fd6a4", lotus: "#9af0c8" };
