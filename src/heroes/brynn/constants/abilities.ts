import type { BrynnAbility } from "../types/ability";

/** her abilities on I, in the order O turns through them */
export const BRYNN_ABILITIES: readonly BrynnAbility[] = ["rend", "quake"];
/** MP each costs tapped */
export const ABILITY_COST: Readonly<Record<BrynnAbility, number>> = { rend: 14, quake: 16 };
/** seconds before each can be cast again */
export const BASE_RECHARGE: Readonly<Record<BrynnAbility, number>> = { rend: 4.5, quake: 6 };
/** I held: the wide form costs this much more MP */
export const WIDE_COST = 1.5;
/** Carry: I once a string blow has landed casts at once from the swing, this much harder, and keeps the string */
export const CARRY = { power: 1.3 } as const;
/** Rend: the floor wave runs this far ahead at this speed, cutting each foe once at this power and throwing it up */
export const REND = { reach: 170, speed: 300, power: 2.4, launch: -220 } as const;
/** Quake: foes within this reach take this power and are thrown up; held, the wider reach and an aftershock this long
 *  after at this share */
export const QUAKE = {
  reach: 64,
  power: 1.9,
  launch: -260,
  height: 30,
  wideReach: 100,
  after: 0.4,
  afterShare: 0.6,
} as const;
/** each ability's HUD tab */
export const ABILITY_TAB: Readonly<Record<BrynnAbility, string>> = { rend: "REND", quake: "QUAKE" };
