import type { Perk } from "../types/skill";
import type { Element } from "../types/spell";

/**
 * Seconds before an element can be cast again, each element on its own clock.
 * Ice freezes a whole line of foes, fire burns an area and the floor, bolt hits one foe and arcs to one more.
 */
export const SPELL_COOLDOWN: Readonly<Record<Element, number>> = { fire: 7, ice: 8, volt: 5.5 };
/** the skill that teaches each element; Kael starts with none */
export const SPELL_PERK: Readonly<Record<Element, Perk>> = { fire: "fireSpell", ice: "iceSpell", volt: "voltSpell" };
/** after any cast the other elements wait at least this long, so switching elements cannot chain spells back to back */
export const SPELL_SHARED_COOLDOWN = 3;
/** the fire flask's throw: speed out of the hand, facing right, and the gravity on it and on Sunflask's child flasks */
export const FLASK_THROW = { vx: 210, vy: -140, gravity: 520 } as const;
