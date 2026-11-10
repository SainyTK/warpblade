/**
 * The shared foe awareness rule (game/enemies/awareness.ts): what a foe does about a hero it cannot see.
 * With no hidden hero and no blind foe nothing here applies, so every hero without a hiding move plays as before.
 */
export const AWARENESS = {
  /** a mini boss facing away from a hidden hero turns this many times slower than its own turn delay */
  miniTurn: 2,
  /** the lost cue: minions this near that faced the hero when he slipped out of sight show a question mark this long */
  lostReach: 160,
  lostTime: 0.6,
} as const;
