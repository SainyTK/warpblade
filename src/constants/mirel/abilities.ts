/** Stopped Clock: the foe ahead stops dead, and part of what it takes lands again when it restarts */
export const STOPPED_CLOCK = {
  mp: 22,
  cooldown: 7,
  reach: 110,
  height: 60,
  /** seconds stopped for a minion or elite, a mini boss and the Warden */
  stop: { minion: 2, mini: 0.8, boss: 0.5 },
  /** ability power on the cast */
  power: 1,
  /** share of the damage taken while stopped that lands again on the restart */
  returns: 0.4,
  /** the cast pose, and when it goes off */
  dur: 12 / 30,
  hit: 6 / 30,
  /** I held: every foe round her within this reach stops for this share of the time, for this many times the MP */
  wide: { reach: 70, stop: 0.6, mp: 1.5 },
} as const;

/** Second Hand: a thin clock hand flies ahead through foes */
export const SECOND_HAND = {
  mp: 14,
  cooldown: 2.5,
  speed: 300,
  range: 150,
  pierce: 3,
  power: 1.1,
  chill: 1,
  dur: 10 / 30,
  hit: 4 / 30,
} as const;
