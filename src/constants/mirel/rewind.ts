/** L: Rewind, back along her own path */
export const REWIND = {
  /** seconds of path it looks back over, and the seconds it takes to play it backwards */
  look: 1.2,
  play: 0.25,
  /** share of the HP lost in those seconds it gives back */
  heal: 0.4,
  sand: 40,
  cooldown: 0.8,
  /** a blow in the first part of it is a perfect dodge */
  dodge: 0.12,
  /** the most path kept, seconds: the longest look any skill gives */
  keep: 2,
} as const;
