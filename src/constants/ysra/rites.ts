import type { RiteDef } from "../../types/ysra/pyre";

/** Ysra's rites in tab order; O cycles through the learned ones */
export const RITES: readonly RiteDef[] = [
  { id: "flare", name: "Flare", tab: "FLARE", perk: "flare", cost: 30, tint: "#ffae48" },
  { id: "flamePillar", name: "Flame Pillar", tab: "PILLAR", perk: "flamePillar", cost: 40, tint: "#ff6a3a" },
  { id: "brazier", name: "Brazier", tab: "BRAZIER", perk: "brazier", cost: 50, tint: "#e0a050" },
];

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

/** Brazier: planted ahead of her, it spits an ember at the nearest foe within `seek` every `every` seconds */
export const BRAZIER = {
  ahead: 16,
  life: 8,
  every: 0.7,
  seek: 150,
  /** seconds an ember takes to reach where its foe stood */
  flight: 0.45,
  gravity: 420,
  power: 1.2,
  burn: 1.5,
  pitch: 1.6,
} as const;

/** Ashen Wake: burning ground left every `spacing` pixels of travel, with at most `cap` patches at once */
export const ASHEN_WAKE = { spacing: 10, cap: 28, life: 3, tick: 0.4, power: 0.25, burn: 1, halfWidth: 5 } as const;
