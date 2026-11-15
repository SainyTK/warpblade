/** Sword Screen: a block lets this share through and costs this much stamina */
export const YUN_GUARD = { chip: 0.3, blockCost: 14 } as const;

/** how a spirit sword draws: its jade body's and glow line's strength, and whether it flashes white */
export const SPIRIT_LOOK = {
  flying: { body: 0.75, glow: 0.28, white: false },
  screen: { body: 0.95, glow: 0.45, white: false },
  struck: { body: 0.95, glow: 0.45, white: true },
} as const;

/** Sword Screen's look: the plate of light behind the fan (radii, the core's strength, a bright rim inside a dark one so
 *  it reads on any ground), how long a blocked blow flashes the swords white, and the flecks thrown toward the attacker */
export const SCREEN_LOOK = {
  plateRx: 8,
  plateRy: 16,
  plateA: 0.4,
  rimA: 0.7,
  edgeA: 0.55,
  plateDy: 6,
  flash: 0.08,
  flecks: 3,
} as const;

/** Deflecting Qi: the parry's qi wave flies `reach` pixels at `speed` and cuts each foe once for `power` times attack
 *  damage */
export const QI_WAVE = { reach: 120, speed: 300, power: 1.2, half: 10 } as const;

/** the warp's extra: each held spirit sword strikes the foe once on arrival for this much attack damage */
export const ARRIVAL_SWORD = { power: 0.12, gap: 0.05, rise: 30 } as const;
