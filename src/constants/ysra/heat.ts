/** Heat: Ysra's second bar, built by glaive blows that land and spent on rites */
export const HEAT = {
  max: 100,
  /** per foe struck by a string blow, a poke, a sweep or an air sweep */
  perFoe: 6,
  /** per foe struck by a lunge, a vault crash, a dive impact or a counter */
  perFoeHeavy: 12,
  /** strike sources that pay the heavy rate, matched as parts of the source name */
  heavySources: ["lunge", "vault", "dive", "counter"],
  /** Kindling: each rank adds this share to every gain */
  kindlingPerRank: 0.2,
  /** Unbroken: below this share of max HP, gains are multiplied by unbrokenScale */
  unbrokenBelow: 1 / 3,
  unbrokenScale: 2,
  /** seconds without a landed blow before Heat starts to drain, and how fast it drains */
  drainDelay: 2.5,
  drainPerSecond: 8,
} as const;

/** Searing Edge: from this share of Heat the glaive burns, and each foe it strikes burns this many seconds */
export const SEARING = { from: 0.5, burn: 2.5 } as const;

/** Overheat: seconds it lasts, attack speed while it lasts, and the flame burst on each struck foe */
export const OVERHEAT = { time: 6, attackRate: 1.3, burstPower: 0.9, burstRadius: 16, burn: 1.5 } as const;

/** Hearthfire: rites cost this share of their Heat, and each heals this share of max HP */
export const HEARTHFIRE = { cost: 0.7, heal: 0.04 } as const;

/** Molten Guard: Heat from a parry and from a block */
export const MOLTEN_GUARD = { parry: 25, block: 5 } as const;

/** Hot Iron: a full lunge above this share of Heat bursts a free pillar this far ahead of her feet */
export const HOT_IRON = { from: 0.5, reach: 26 } as const;
