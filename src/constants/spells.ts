import type { Element, KaelAbility } from "../types/spell";

/** Kael's abilities on I in the order O turns through them: the two base abilities, then the element spells */
export const KAEL_ABILITIES: readonly KaelAbility[] = ["lance", "burst", "fire", "ice", "volt"];
/** the skill that teaches each element */
export const ELEMENT_SKILL: Readonly<Record<Element, string>> = { fire: "k_flame", ice: "k_frost", volt: "k_volt" };
/** MP each ability costs */
export const ABILITY_COST: Readonly<Record<KaelAbility, number>> = {
  lance: 12,
  burst: 15,
  fire: 18,
  ice: 18,
  volt: 18,
};
/** seconds before a base ability can be cast again; the element spells take theirs from their skill's level */
export const BASE_RECHARGE = { lance: 4, burst: 6 } as const;
/** an element spell's recharge when its skill sets none */
export const ELEMENT_RECHARGE = 3;
/** I held: the wide form of a spell costs this much more MP than the tapped one */
export const WIDE_COST = 1.5;
/** Spellblade: I during a combo, after this many hits, casts at once and this much harder */
export const SPELLBLADE = { after: 2, power: 1.5 } as const;
/** Crystal Lance: a crystal crescent that flies ahead and cuts each foe in its line once, passing guards */
export const LANCE = { power: 2.5 } as const;
/** Crystal Burst: a ring of crystal around Kael that pushes foes away */
export const BURST = { power: 1.5, reach: 40, push: 260 } as const;
/** the fire flask's throw: speed out of the hand, facing right, and the gravity on it and on Sunflask's child flasks */
export const FLASK_THROW = { vx: 210, vy: -140, gravity: 520 } as const;
/** a second flask flies this much slower, so the two land apart */
export const SECOND_FLASK = 0.72;
