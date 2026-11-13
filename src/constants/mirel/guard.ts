/**
 * K: her time-bubble guard. Blows and shots slow as they reach the bubble round her, and a block lets a fair share
 * through for a fair bit of stamina; the parry, the Stopped Moment, is where her guard pays.
 */
export const TIME_GUARD = {
  chip: 0.35,
  blockCost: 18,
  /** the bubble's radius round her chest, and the pace of foes and foe shots inside it */
  radius: 22,
  pace: { minion: 0.75, mini: 0.85, boss: 0.9, shot: 0.35 },
} as const;

/**
 * The Stopped Moment, her parry: the attacker stops in time, storing the damage it takes for its restart, and the HP she
 * lost lately rewinds back.
 */
export const STOPPED_MOMENT = {
  /** seconds a minion or elite, a mini boss and the Warden stay stopped */
  stop: { minion: 1.6, mini: 0.8, boss: 0.5 },
  /** share of the damage taken while stopped that lands again on the restart */
  returns: 0.4,
  /** seconds of HP loss it looks back over, and the share of it she gets back */
  back: 2,
  heal: 0.5,
} as const;
