/**
 * The fixed numbers of Brannoc's skill behaviours (src/game/skills/brannoc): reaches, speeds, timings and the bleeds
 * his summons and spells lay. What a skill's level changes lives in its row in src/constants/characters/brannoc/skills.
 */

/** the bleed his spells, summons and trail lay: stacks a hit lays, the most a foe carries, attack damage a second per
 *  stack, seconds between ticks and how long the stacks last after the last was laid */
export const SKILL_BLEED = { stacks: 1, max: 6, power: 0.1, every: 0.5, duration: 3 } as const;

/** Blood Geyser: how far it looks for foes, how tall a pillar rises, seconds between one pillar and the next, the
 *  launch, the mark's seconds, and how far ahead of him the pillar rises with no foe in reach */
export const GEYSER = { reach: 120, height: 52, stagger: 0.06, launch: -150, markTime: 4, bare: 40 } as const;

/** Hurled Axe: how far it flies, its speed, how close it must pass a foe, the second axe's climb, and its spin */
export const HURLED_AXE = { reach: 160, speed: 300, touch: 6, high: -0.35, spin: 22, chest: 18, knock: 30 } as const;

/** Twin Fangs: the orbit's radius, its turns a second, its squash, attack damage a strike, and the wait per foe */
export const TWIN_FANGS = { radius: 30, turns: 1.6, squash: 0.45, power: 0.8, every: 0.4 } as const;

/** Blood Pact's Oathbound: seconds each kill in the pact adds */
export const OATH_ADD = 1;

/** Open Wounds' spread: how far a dying foe's stacks reach */
export const BLEED_SPREAD = 40;

/** Haemorrhage: how far Red Bloom chains, and the drop over a marked foe */
export const HAEMORRHAGE = { bloom: 40, dropHigh: 7 } as const;

/** Blood Wolves: run speed, how far a wolf looks for a foe and reaches up to bite, the bite, and seconds to fade */
export const WOLF = {
  speed: 240,
  look: 220,
  leap: 40,
  bite: 12,
  biteEvery: 0.6,
  knock: 20,
  fade: 0.35,
  show: 0.15,
  /** a one-bite wolf with nothing to bite leaves after this long */
  idle: 0.8,
} as const;

/** Forebear: where the first stands behind him, the gap to the next, its swing's reach and height, and its look */
export const FOREBEAR_SPEC = {
  behind: 16,
  apart: 13,
  reach: 46,
  height: 40,
  follow: 7,
  swing: 0.22,
  show: 0.25,
  fade: 0.4,
  knock: 30,
  mark: { seconds: 3, bonus: 0.15 },
} as const;

/** Carrion Ravens: flight speed, how close is a strike, the wait between flocks, and seconds to fly off */
export const RAVEN = { speed: 280, turn: 9, touch: 6, cooldown: 1, leave: 0.5, knock: 15, life: 2 } as const;

/** Carrion Storm: ravens in the cloud, its radius and squash, turns a second, and the wait per foe */
export const RAVEN_STORM = { ravens: 9, radius: 34, squash: 0.5, turns: 0.9, every: 0.5 } as const;

/** Blood Trail: seconds between ticks, the shortest trail worth leaving, and River of Red's extra seconds and burst */
export const BLOOD_TRAIL = { tick: 0.5, least: 6, slow: 0.6, river: { more: 3, power: 2, height: 30 } } as const;

/** Wolf's Road: how far the wolf runs, its speed and attack damage to each foe it passes */
export const WOLF_ROAD = { reach: 160, speed: 320, power: 1.2 } as const;

/** Crimson Moon: the arc's reach both ways, its speed, height and attack damage */
export const CRIMSON_MOON = { reach: 90, speed: 280, height: 14, power: 1 } as const;
