import type { BaseAbility, BrynnAbility, SpellAbility } from "../types/ability";

/** her abilities on I, in the order O turns through them: the two base ones, then the spells her skills teach */
export const BRYNN_ABILITIES: readonly BrynnAbility[] = ["rend", "quake", "arc", "pillars", "cry"];
/** the skill that teaches each spell */
export const SPELL_SKILL: Readonly<Record<SpellAbility, string>> = {
  arc: "br_arc",
  pillars: "br_pillars",
  cry: "br_cry",
};
/** MP each costs tapped */
export const ABILITY_COST: Readonly<Record<BrynnAbility, number>> = {
  rend: 14,
  quake: 16,
  arc: 16,
  pillars: 18,
  cry: 14,
};
/** seconds before a base ability can be cast again; the spells take theirs from their skill */
export const BASE_RECHARGE: Readonly<Record<BaseAbility, number>> = { rend: 4.5, quake: 6 };
/** a spell's recharge when its skill sets none */
export const SPELL_RECHARGE = 5;
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
/** Ember Arc: the crescents fly this far apart in time, and its wide form's fan sits at these heights above the floor */
export const ARC = { gap: 0.14, height: 18, fan: [8, 18, 30] } as const;
/** Brand Pillars: each pillar bursts this long after the one before, throws foes up this fast, the next line comes after */
export const PILLARS = { every: 0.07, launch: -240, again: 0.5 } as const;
/** War Cry: how hard the roar pushes foes and how long they reel */
export const CRY = { push: 220, stagger: 0.8 } as const;
/** each ability's HUD tab */
export const ABILITY_TAB: Readonly<Record<BrynnAbility, string>> = {
  rend: "REND",
  quake: "QUAKE",
  arc: "ARC",
  pillars: "PILLARS",
  cry: "CRY",
};
