import type { Perk } from "../types/skill";
import type { Element } from "../types/spell";
import type { PillarShape, RiteId } from "../types/ysra/pyre";
import { FLAME_PILLAR } from "./ysra/rites";

/** the perk of each element's evolved form */
export const EVOLVED_PERK: Readonly<Record<Element, Perk>> = {
  fire: "sunflask",
  ice: "glacierBloom",
  volt: "thunderhead",
};

/** the perk of each of Ysra's rites that has an evolved form */
export const EVOLVED_RITE: Readonly<Partial<Record<RiteId, Perk>>> = {
  flamePillar: "pyreColonnade",
};

/** the gold flash when an evolution is learned and play resumes */
export const EVOLVE_CELEBRATION = {
  ring: 40,
  ringLife: 0.6,
  light: 70,
  lightK: 0.9,
  lightLife: 0.6,
  stars: 16,
  banner: 2,
} as const;

/** Sunflask: a bigger flask whose burst throws three child flasks that burst on their own */
export const SUNFLASK = {
  /** the glint at the hand: a white one this much larger is drawn over the fire one */
  glintGrow: 2,
  flask: { body: 3.4, inner: 2.2, glow: 24, glowK: 0.6, trail: 3 },
  /** the child flasks fly at the live foes nearest the burst within this many pixels along the floor, nearest first */
  reach: 96,
  /** seconds each child takes to reach its foe, on a low, short arc */
  flight: 0.42,
  /** the fastest a child flies sideways */
  maxVx: 230,
  /** with no foe in reach, the children land this far from the burst, facing right */
  fallback: [-32, 32, 64],
  child: {
    body: 2.2,
    trail: 1,
    life: 1.2,
    /** shares of the main burst */
    radius: 0.6,
    damage: 0.5,
    brands: 2,
    shake: 0.16,
    amp: 2,
    hitStop: 0.03,
  },
} as const;

/** Glacier Bloom: a second line behind the hero, and a crown spire at the end of the front line */
export const GLACIER_BLOOM = {
  /** the line behind the hero, spaced like the front line */
  backHeights: [14, 18, 20, 16],
  spire: {
    height: 38,
    width: 7,
    /** side crystals, as shares of the spire's height */
    sides: [0.55, 0.45],
    light: 44,
    lightK: 0.9,
    /** it stands this much longer than the line */
    stand: 0.35,
  },
  burst: {
    reach: 36,
    /** damage as a multiple of ability power */
    power: 1.2,
    freeze: 1.5,
    light: 50,
    shards: 14,
    shake: 0.18,
    amp: 2,
  },
} as const;

/** Thunderhead: a storm cloud over the strike that calls three more bolts */
export const THUNDERHEAD = {
  y: 22,
  /** kept this far inside the stage edges */
  margin: 24,
  grow: 0.25,
  width: 34,
  height: 10,
  drift: 30,
  light: 30,
  flicker: [0.2, 0.4],
  /** seconds after the main strike that each follow-up bolt lands */
  strikes: [0.8, 1.6, 2.4],
  /** the underside brightens this long before each bolt */
  warn: 0.08,
  /** horizontal reach from the cloud's centre to a foe it strikes */
  reach: 70,
  /** damage as multiples of ability power */
  power: 1.5,
  arcPower: 1,
  arcs: 1,
  shock: 0.6,
  glow: 0.6,
  fade: 0.4,
} as const;

/** Pyre Colonnade: a hotter Flame Pillar under a ringed sigil, then two smaller pillars a beat later on either side */
export const PYRE_COLONNADE = {
  main: { ...FLAME_PILLAR, power: 6.6, ring: true } satisfies PillarShape,
  flank: {
    ...FLAME_PILLAR,
    power: 3.85,
    height: 64,
    halfWidth: 7,
    launch: 260,
    /** bursts 0.12 seconds after the main pillar */
    warn: 0.34,
    stand: 0.4,
    sigil: 0.7,
    shake: 0.12,
    amp: 2,
    hitStop: 0.04,
  } satisfies PillarShape,
  /** each flank stands this far to either side of the main pillar */
  offset: 30,
  /** a flank is skipped when it would stand closer than this to a stage edge */
  margin: 8,
} as const;
