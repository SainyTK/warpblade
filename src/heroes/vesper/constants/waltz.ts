/** Dusk Waltz, Vesper's ultimate, and what its skill (`ve_waltz`) adds */

/** how far the waltz reaches at each charge level; level 4 takes every foe on the screen */
export const WALTZ_REACH = [80, 130, 200, 340] as const;
/** each foe takes this share of a charge level's power, spread over its cuts */
export const WALTZ_SHARE = 0.75;
/** cuts on each foe: this many, one more for each this many Tempo stacks; the seconds between cuts across the dance */
export const WALTZ_CUTS = { base: 2, perTempo: 4, gap: 0.05, first: 0.12 } as const;
/** each Tempo stack adds this share to every cut */
export const WALTZ_TEMPO = 0.04;
/** her afterimage dances this long after the release, and she stands faint until it returns */
export const WALTZ_FADE = 0.9;
