/** Second Chance: a fatal blow plays her path back */
export const REWIND = {
  /** seconds of path it plays back, and the seconds it takes to play it */
  look: 2,
  play: 0.25,
  /** the most path kept, seconds: the longest look back any skill gives */
  keep: 3,
} as const;
