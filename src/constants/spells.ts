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
/** Crystal Lance held: a fan of lances, each climbing this many pixels a pixel flown (negative is up); a foe is cut once */
export const LANCE_FAN = [-0.42, -0.18, 0.1] as const;
/** Crystal Burst: a ring of crystal around Kael that pushes foes away */
export const BURST = { power: 1.5, reach: 40, push: 260 } as const;
/** Crystal Burst held: a ring this many times as wide that pulls foes in to Kael */
export const WIDE_BURST = { reach: 2, pull: 200 } as const;
/** Fire Flask held: the flask bursts into a wall of flame this wide each side and this tall, standing this long, burning
 *  foes in it each tick for this share of the burst's power */
export const FIRE_WALL = { halfWidth: 22, height: 16, life: 3, power: 0.3 } as const;
/** Ice Spikes held: the line runs both ways and every foe within this reach of Kael is slowed this long */
export const ICE_FIELD = { reach: 110, chill: 2.5 } as const;
/** Lightning held: bolts fall one after another on this many foes plus the bolt's arcs, across the whole screen, each
 *  this share of the bolt's power */
export const BOLT_CHAIN = { base: 3, share: 0.6, gap: 0.08 } as const;
/** the fire flask's throw: speed out of the hand, facing right, and the gravity on it and on Sunflask's child flasks */
export const FLASK_THROW = { vx: 210, vy: -140, gravity: 520 } as const;
/** a second flask flies this much slower, so the two land apart */
export const SECOND_FLASK = 0.72;
