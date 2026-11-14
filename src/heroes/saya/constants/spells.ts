/** Saya's three spells on I: the MP each costs, its tab label and the colour its tab lights in */
export const SPELL = {
  crescent: { cost: 12, label: "WAVE", tint: "#b4c0ff" },
  rain: { cost: 16, label: "RAIN", tint: "#6a78d8" },
  still: { cost: 8, label: "STILL", tint: "#f4f6ff" },
} as const;

/** Crescent Wave: its flight speed, half its height, how far its bow leans ahead, the reach of its burst, and the
 *  heights of the wide form's three crescents above the floor */
export const CRESCENT = { speed: 280, half: 14, bow: 4, burstReach: 30, wide: [30, 18, 6], low: 8 } as const;

/** Ink Rain: how high the cloud hangs, a drop every this many s, how fast drops fall, how fast the cloud drifts, how
 *  far ahead it forms, drops that pin a foe, and how long the great drop knocks foes down */
export const RAIN = { height: 64, every: 0.06, fall: 260, drift: 40, ahead: 40, pinAfter: 5, lastStun: 0.6 } as const;

/** Still Water: the radius of the ward that breaks foe shots round her */
export const STILL = { ward: 26 } as const;
