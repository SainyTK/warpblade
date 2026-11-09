/** K: the Stillfield, a circle where foes and their shots crawl */
export const STILLFIELD = {
  radius: 44,
  /** centred this far ahead of her, at this height above her feet; with W held this far straight above her */
  ahead: 56,
  chest: 16,
  above: 48,
  /** Sand on the press, and a second while K is held */
  open: 25,
  perSecond: 18,
  /** it stays at least this long (a tap) and at most this long */
  least: 0.6,
  most: 4,
  /** seconds after it closes before the next */
  cooldown: 1.2,
  /** the pace inside of a minion or elite, a mini boss, the Rift Warden, and a foe shot */
  pace: { minion: 0.2, mini: 0.4, boss: 0.6, shot: 0.1 },
  /** the snap as it closes: ability power to each foe inside, pushed this far out; minions stagger */
  snap: 0.5,
  push: 30,
  stagger: 0.3,
  /** the cast pose on the press */
  cast: 0.2,
} as const;

/** her Sand, the SD bar */
export const SAND_BAR = {
  max: 100,
  /** refilled a second, except while a field stands and this long after a spend */
  refill: 12,
  wait: 0.6,
  /** a Toll that hits gives this much */
  toll: 3,
} as const;
