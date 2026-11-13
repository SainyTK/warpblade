import type { RiteDef } from "../../types/ysra/pyre";

/** Ysra's rites in tab order, after her vault: Flare and Cinder Lash from the start, the others with their skills; O
 *  turns through the ones she has. A skill's rite costs the Heat its level sets; Overheat spends all of it. */
export const RITES: readonly RiteDef[] = [
  { id: "flare", name: "Flare", tab: "FLARE", cost: 30, tint: "#ffae48" },
  { id: "cinderLash", name: "Cinder Lash", tab: "LASH", cost: 25, tint: "#ff8a3a" },
  { id: "flamePillar", name: "Flame Pillar", tab: "PILLAR", skill: "y_pillar", cost: 40, tint: "#ff6a3a" },
  { id: "brazier", name: "Brazier", tab: "BRAZIER", skill: "y_brazier", cost: 50, tint: "#e0a050" },
  { id: "overheat", name: "Overheat", tab: "OVERHEAT", skill: "y_overheat", cost: 60, tint: "#ffe08a" },
];

/** the wide forms on I held: Flare's ring this much wider at this share of its power, throwing foes this much farther;
 *  Cinder Lash each way at this share; Flame Pillar this many more pillars, on both sides, each at this share */
export const RITE_WIDE = {
  flareRadius: 1.7,
  flarePower: 0.7,
  flareThrow: 1.3,
  lashShare: 0.75,
  pillars: 2,
  pillarShare: 0.5,
} as const;

/** Cinder Lash: a whip of fire lashed along the floor `reach` pixels ahead in `out` seconds, striking every foe on it
 *  for `power` times ability power and dragging the nearest `drag` pixels toward her */
export const CINDER_LASH = {
  reach: 70,
  out: 0.12,
  back: 0.16,
  power: 3,
  drag: 30,
  height: 18,
  burn: 1,
  pitch: 1.1,
} as const;

/** Flare: a ring of fire around her feet that throws foes back and heals her this share of max HP. Damage is a multiple
 *  of ability power. */
export const FLARE = { radius: 38, power: 4, kx: 230, ky: -150, burn: 1.5, pitch: 0.8, heal: 0.05 } as const;

/** Flame Pillar: a pillar under the nearest foe ahead, found within `seek` pixels, or `fallback` ahead of her */
export const FLAME_PILLAR = {
  seek: 140,
  fallback: 48,
  /** seconds the sigil glows on the floor before the pillar bursts */
  warn: 0.22,
  /** seconds the pillar stands */
  stand: 0.5,
  halfWidth: 9,
  height: 84,
  power: 5.5,
  launch: 330,
  burn: 2,
  pitch: 1.2,
  /** the sigil at its base size, with no outer ring */
  sigil: 1,
  ring: false,
  shake: 0.25,
  amp: 3,
  hitStop: 0.07,
} as const;

/** Brazier: planted ahead of her, it spits embers at the foes nearest it within `seek`; its timing and power are the
 *  skill's level */
export const BRAZIER = {
  ahead: 16,
  seek: 150,
  /** seconds an ember takes to reach where its foe stood */
  flight: 0.45,
  gravity: 420,
  /** foes this close to the bowl are burned by Brazier's aura every `auraTick` seconds */
  aura: 12,
  auraTick: 0.4,
  /** the burst when it burns out reaches this far */
  burstRadius: 50,
  pitch: 1.6,
} as const;

/** burning ground: Ashen Wake lays a patch every `spacing` pixels of travel; at most `cap` patches burn at once, each
 *  ticking every `tick` seconds and setting foes burning for `burn` seconds */
export const ASHEN_WAKE = { spacing: 10, cap: 28, tick: 0.4, burn: 1 } as const;
