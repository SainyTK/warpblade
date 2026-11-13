/** Smoke Knot: a cloud at his feet that blinds the minions inside and hides him while he stands in it */
export const SMOKE_KNOT = {
  mp: 18,
  cooldown: 8,
  width: 72,
  height: 40,
  life: 3,
  /** seconds a minion inside stays blind, refreshed every frame it is inside */
  blind: 0.3,
  /** seconds the smoke takes to roll out, and to thin at the end */
  roll: 0.2,
  thin: 0.5,
  /** the cast pose, and when the knot drops */
  dur: 9 / 30,
  hit: 4 / 30,
  /** I held: a bigger knot for more MP, its cloud this much wider and taller */
  wideMp: 28,
  wideGrow: 1.6,
} as const;

/** Hamstring: a low crouching sweep that trips the first foe it hits */
export const HAMSTRING = {
  mp: 14,
  cooldown: 4,
  near: 6,
  far: 30,
  /** ability power and attack damage on the sweep */
  ap: 0.8,
  ad: 0.4,
  /** seconds a minion, an elite and a mini boss lie tripped; the Warden does not trip */
  stun: { minion: 0.9, elite: 0.6, mini: 0.3 },
  dur: 12 / 30,
  hit: 5 / 30,
  /** I held: a spinning sweep that trips foes on both sides of him, for more MP */
  wideMp: 22,
} as const;

/** the spell pose for his spell skills: a hand flung forward, the spell leaving it on its frame */
export const SPELL_CAST = { dur: 10 / 30, hit: 4 / 30 } as const;
