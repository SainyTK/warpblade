/** numbers of Aldric's skills that their rows leave out */

/** Oathblade's wave: speed, reach and half height before its size */
export const OATH_WAVE = { speed: 260, reach: 70, half: 9 } as const;
/** Crestfall: seconds between its rings, and how much wider each later ring runs */
export const CREST_RING = { gap: 0.18, grow: 0.25 } as const;
/** Iron Retort's wave and Retribution's spread of waves, climbing this much per pixel */
export const RETORT_WAVE = { speed: 280, reach: 90, half: 10, spread: 0.2 } as const;
/** Retribution strikes every foe in this box ahead */
export const RETRIBUTION_BOX = [-2, -42, 52, 2] as const;
/** Shield Step's ring as Phalanx Step: its radius; the Bulwark the dodge ends behind lasts this long */
export const STEP = { ring: 34, barrier: 1.5 } as const;
/** Bulwark Arrival's ring of light on arrival and the burst when Bulwark breaks */
export const ARRIVAL_RING = 30;
export const SHATTER_RING = 32;
/** Skyfall: Valor per foe, the Bulwark the landing raises, the burning light's width */
export const SKYFALL = { barrier: 1.5, groundWidth: 26, burn: 0.4 } as const;
/** Sunbrand's spread as Solar Brand, in px round the fallen foe */
export const BRAND_SPREAD = 40;
/** Penance: seconds a stack lasts, seconds between ticks, the most laid by a parry */
export const PENANCE = { time: 4, every: 0.5 } as const;
/** Verdict: the sword of light's fall, its pillar as Final Verdict, and its mark's seconds */
export const VERDICT = { fall: 0.18, gap: 0.1, mark: 3, half: 9 } as const;
/** Oathsworn: seconds between his cuts, how long he stays after the last, his Bulwark's seconds */
export const OATHSWORN = { first: 0.12, gap: 0.16, linger: 0.3, barrier: 2 } as const;
/** Sun Lion: its walk speed, pounce reach and leap, roar radius */
export const LION = { speed: 70, reach: 90, leap: 0.25, roar: 34, mark: 3 } as const;
/** Dawn Falcon: its speed, how far a swoop runs and its height band */
export const FALCON = { speed: 300, reach: 150, half: 12, mark: 3, burnTime: 3 } as const;
/** Resolve's small Sanctuary as Unbroken, at this charge level */
export const UNBROKEN_LEVEL = 1;
/** Iron Vow's lance thrown back as Iron Fortress */
export const FORTRESS_LANCE = { pierce: 1 } as const;
/** Sanctuary's pillars: the share of a burn each deals */
export const DOME_PILLAR = { share: 0.6, half: 7 } as const;
/** the Bulwark kindling Radiance raises with Resolve, in seconds */
export const RESOLVE_BARRIER = 2;
/** High Noon: a small pillar from the burning light every this many seconds, at this share of Sunpillar */
export const DAWN_PULSE = { every: 1, delay: 0.2, share: 0.35, half: 6 } as const;
