/**
 * Her warp: the glaive hurled like a javelin, driven into the foe or the floor, and wrenched free when she warps to its
 * haft. The throw, its flight, its cost and the arrival blow's power are the shared warp's (`WARP`); these are her look
 * and her small extra.
 */
export const JAVELIN = {
  /** Heat the arrival builds before Ember Javelin raises it */
  heat: 8,
  /** the wrench reaches this far ahead of her feet and this far behind, up to this high */
  ahead: 34,
  behind: 8,
  height: 44,
  /** the embers torn out where the glaive comes free, this far ahead of her feet and this high */
  burstAhead: 16,
  burstUp: 14,
  /** the thrown glaive from point to butt cap, the blade's length at its head and how far its belly swells */
  length: 30,
  head: 9.5,
  belly: 2.7,
} as const;

/** Ember Javelin's rail: the line she warped along is struck again this long after the arrival, and back after twice
 *  as long; the rail strikes foes this far above and below her middle */
export const RAIL = { delay: 0.1, top: -30, bottom: -4 } as const;
