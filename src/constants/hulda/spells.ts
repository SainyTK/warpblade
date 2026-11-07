import { frame } from "../hero";

/** Iron Chain: she thrusts the gauntlet out on its chain on this frame, the head flies this fast and drags foes home */
export const CHAIN = {
  dur: frame(14),
  throw: frame(4),
  /** pixels a second the head flies out */
  speed: 520,
  /** seconds a hooked foe takes to be dragged to her feet */
  drag: 0.25,
  /** the head's reach and height above her feet */
  hookR: 7,
  height: 18,
  /** where the heap lands, ahead of her feet */
  heap: 12,
  /** a dragged foe lies stunned this long once in the heap */
  stun: 0.8,
  /** Hell Chains: the angles of the fan, in radians above the floor, ahead then behind */
  fan: [0, 0.5],
  /** the heap's stomp ring */
  stompRing: 50,
  /** a big foe hooked without the yank reels this long */
  bigStun: 0.4,
  /** pixels a second she flies to a big foe when yanked */
  yank: 360,
} as const;

/** Tremor Stomp: her foot comes down on this frame; the second tremor follows after `gap` */
export const STOMP = {
  dur: frame(14),
  hit: frame(6),
  gap: 0.4,
  /** foes on the floor reel this long, and minions are thrown up this fast */
  stun: 0.4,
  launch: -240,
  /** fliers in reach are shaken down this far and reel this long */
  shake: 40,
  flierStun: 0.9,
  /** a walker counts as on her floor when its feet are this close to hers */
  floor: 14,
  /** the tremor's ring is at most this many pixels deep */
  ringDepth: 6,
} as const;

/** Iron Wall: the release clip after the brace, and its reach */
export const WALL = {
  /** the release punch runs this long after the brace, landing on this frame of it */
  release: frame(12),
  hit: frame(4),
  /** the release strikes this far ahead, or this far round her as a ring */
  ahead: 34,
  ring: 34,
  /** she is safe this long after each blow the brace takes, so a crowd can load it several times */
  safe: 0.2,
  kx: 220,
  stun: 0.6,
} as const;
