import { frame } from "../hero";

/** K: Boom, both palms flat on the drum. Radii in art pixels round him, seconds in game time */
export const BOOM = {
  stamina: 25,
  wait: 0.5,
  /** on the beat: its ring, how far minions and elites are pushed out, shots erased, and the untouchable moment */
  ring: 40,
  pushMinion: 52,
  pushElite: 46,
  shots: 48,
  guard: 0.12,
  /** off the beat: a smaller ring, the same push, no shots and no untouchable moment */
  offRing: 26,
  /** the push runs this long */
  push: 0.12,
  /** damage to each foe in the ring: ability power and attack damage */
  ap: 0.5,
  ad: 0.2,
  /** the 2 frame load with the drum pulled to his belly, the strike, and the recovery */
  hit: frame(2),
  dur: frame(9),
} as const;

/** L: Beat Step, a short measured step */
export const BEAT_STEP = {
  /** pixels by Groove tier */
  reach: [34, 40, 46, 52],
  /** a step in the air goes this share of the floor step, once per airtime */
  air: 0.7,
  stamina: 18,
  wait: 0.25,
  /** the 2 frame load on the back foot, the slide, and the landing into the knees */
  load: frame(2),
  slide: 0.15,
  land: frame(4),
  /** a blow in this first part of an on-beat step is a perfect dodge */
  dodge: 0.12,
} as const;

/** I: Steady Hand and Thunder Skin */
export const STEADY_HAND = { mp: 20, cooldown: 12, beats: 8 } as const;
export const THUNDER_SKIN = {
  mp: 16,
  cooldown: 5,
  /** the floor wave: reach and speed, on the beat a longer reach that knocks minions down */
  reach: 160,
  onBeatReach: 200,
  speed: 260,
  ap: 0.9,
  ad: 0.4,
} as const;

/** the cast poses: Steady Hand taps the drum rim with a mallet, Thunder Skin drops to one knee and beats the floor */
export const ABILITY_CAST = { dur: frame(10), hit: frame(4) } as const;
export const SPELL_CAST = { dur: frame(10), hit: frame(4) } as const;

/** U: Drumroll, the drum planted, a roll of heavy beats at 150 beats a minute whatever his tempo */
export const DRUMROLL = {
  /** beats by charge level, and each beat's ring radius */
  beats: [2, 3, 4, 6],
  rings: [70, 90, 110, 140],
  /** real beats a minute */
  bpm: 150,
  /** each ring: the level's power times this share of attack damage plus ability power */
  share: 0.3,
  /** the last ring throws minions up this fast */
  launch: -160,
  /** the plant before the first beat, and the settle after the last */
  plant: frame(4),
  settle: frame(8),
  /** Groove is at least this much after it */
  groove: 8,
  shake: 2,
  lastShake: 4,
} as const;

/** ground covered by one full stride of his walk: a broad, heavy step */
export const JORY_STRIDE = 28;
