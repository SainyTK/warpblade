import type { Color } from "../../../types/color";
import { hex } from "../../../utils/color";
import type { ZafirAbility } from "../types/abilities";

/** Zafir's abilities on I in the order O turns through them: the two base abilities, then the spells his skills teach */
export const ZAFIR_ABILITIES: readonly ZafirAbility[] = ["spout", "crescent", "gale", "glass", "quicksand"];
/** the skill that teaches each spell */
export const SPELL_SKILL = { gale: "za_gale", glass: "za_glass", quicksand: "za_quicksand" } as const;
/** MP each ability costs; I held, its wide form costs this much more */
export const ABILITY_COST: Readonly<Record<ZafirAbility, number>> = {
  spout: 14,
  crescent: 12,
  gale: 16,
  glass: 18,
  quicksand: 16,
};
export const WIDE_COST = 1.5;
/** seconds before a base ability can be cast again; a spell takes its recharge from its skill */
export const BASE_RECHARGE = { spout: 3.5, crescent: 3 } as const;
export const SPELL_RECHARGE = 4;
/** the cast: seconds from the press to the release, and to the end of the cast pose */
export const SANDCAST = { release: 0.14, end: 0.34 } as const;
/**
 * Sandspout: a small whirl of sand that travels ahead along the floor, lifting the first time it catches a foe and
 * cutting it again while the foe stays in it. Held, two spouts go out, one each way.
 */
export const SPOUT = { speed: 120, life: 1.05, reach: 12, height: 34, every: 0.3, power: 0.7, launch: 190 } as const;
/**
 * The crescent throw: the scimitar flies out along a curve and comes back to his hand, cutting each foe once out and
 * once back. J while it flies calls it back at once into a catch cut round him. Held, it circles round him twice.
 */
export const CRESCENT = {
  out: 92,
  rise: 22,
  time: 0.8,
  power: 1,
  catchPower: 0.8,
  catchReach: 30,
  hitReach: 10,
} as const;
export const CRESCENT_ORBIT = { radius: 34, turns: 2, time: 1.2, every: 0.3, power: 0.6 } as const;
/** the colour of each ability as CSS: its HUD tab when selected */
export const ABILITY_TINT: Readonly<Record<ZafirAbility, string>> = {
  spout: "#f0cf8a",
  crescent: "#ffe4a0",
  gale: "#ff9a4a",
  glass: "#9ee0d8",
  quicksand: "#c8945a",
};
/** the same colours for drawing: the touch button rims and faces */
export const ABILITY_COLOR = Object.fromEntries(
  Object.entries(ABILITY_TINT).map(([a, css]) => [a, hex(css)]),
) as Readonly<Record<ZafirAbility, Color>>;
/** each ability's tab label */
export const ABILITY_LABEL: Readonly<Record<ZafirAbility, string>> = {
  spout: "SPOUT",
  crescent: "CRESCENT",
  gale: "GALE",
  glass: "GLASS",
  quicksand: "SINK",
};
