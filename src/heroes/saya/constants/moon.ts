/**
 * Silent Moon, Saya's ultimate: the foes on screen are held still, ink lines cross the stage through them one after
 * another, then she sheathes and every line bursts. Each charge level draws more lines.
 */
export const SILENT_MOON = {
  /** lines drawn at each charge level, 1 to 4 */
  lines: [3, 5, 8, 12],
  /** each line's burst on a foe it crosses, as a share of the charge level's power */
  share: 0.6,
  /** a foe within this many px of a line is on it */
  width: 9,
  /** the lines are drawn over this many seconds from the cast */
  drawn: 0.6,
  /** a burst knocks foes down this long */
  stun: 0.7,
  /** how far a line leans from level, at most, in radians */
  lean: 0.7,
  /** seconds the mark of its skill lasts */
  markTime: 4,
} as const;
