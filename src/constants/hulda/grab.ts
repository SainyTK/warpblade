import { frame } from "../hero";

/** K on the floor: both hands reach out, and catch the nearest foe in the box while it is live */
export const GRAB = {
  dur: frame(10),
  from: frame(3),
  to: frame(6),
  box: [0, -24, 18, -2] as const,
} as const;

/** a foe too big to hold is crushed in both hands instead */
export const CRUSH = { dur: frame(12), hit: frame(6), power: 1.3, stop: 0.06 } as const;

/** a held foe: where it sits, how long she keeps it and the knees she can drive into it */
export const HOLD = {
  /** pixels ahead of her a small foe's centre sits; a bigger foe sits further out by the half width past `grip` */
  ahead: 10,
  grip: 4,
  /** a walker's feet sit this far above hers, a flier's centre this far */
  walkerY: -6,
  flierY: -20,
  time: 1.4,
  /** she walks at this share of her speed while she holds a foe */
  walk: 0.5,
  /** the stun kept on the held foe, so it never acts in her hands */
  stun: 0.1,
  /** a foe she drops when a blow breaks no plate lies stunned this long */
  dropStun: 0.3,
  /** a hold counts as live for this long after she last moved the foe, so a second hero cannot take it */
  claim: 0.1,
} as const;

/** J while holding: a knee into the held foe */
export const KNEE = { dur: frame(8), hit: frame(3), max: 3, power: 0.5 } as const;

/** how the throw picks itself: foes within `ahead` in front against those within `behind`; `swing` is how near counts for
 *  Giant Swing */
export const THROW_PICK = { ahead: 100, behind: 40, swing: 40 } as const;

/** K while holding, and how each throw lands */
export const THROWS = {
  forward: { dur: frame(10), release: frame(5), power: 1.2, vx: 320, vy: -120 },
  suplex: {
    dur: frame(14),
    lift: frame(5),
    slam: frame(10),
    behind: 14,
    power: 2.2,
    stun: 1.2,
    ring: 30,
    ringPower: 0.8,
    ringStun: 0.4,
    stop: 0.1,
    shake: [0.3, 3] as const,
  },
  /**
   * Giant Swing: turns round her (the skill's count, power and reach), each `turn` long so two or three stay readable, a
   * hit on every foe near each (Cyclone: every `beat`), then the forward release over `settle`; the clip's spin runs from
   * `loop` to its release key and repeats for turns past two. Level 7's release knocks down foes within `knock`.
   */
  swing: {
    dur: frame(24),
    release: frame(20),
    turn: frame(10),
    loop: frame(2),
    settle: frame(4),
    beat: 0.25,
    kx: 160,
    knock: 30,
    knockStun: 0.8,
  },
} as const;

/** a body thrown forward: it flies this long, strikes each foe it touches once, and lands hard */
export const THROWN = {
  life: 0.6,
  power: 1.0,
  kx: 200,
  stun: 0.6,
  stop: 0.04,
  landPower: 0.6,
  landStun: 0.8,
  /** Wrecking Throw: a struck foe flung on flies this fast; a bounce throws the body up this fast */
  flingVx: 240,
  flingVy: -90,
  bounceVx: 110,
  bounceVy: -150,
  /** Human Cannonball: the body flies level this fast until it is this near a wall, or this long at most */
  cannonVx: 340,
  wall: 8,
  cannonLife: 2,
} as const;

/** K in the air: a lunge down with both hands, a ride to the floor and a slam */
export const SKYFALL = {
  lunge: frame(6),
  box: [0, -26, 20, 4] as const,
  ride: 300,
  power: 2.0,
  ring: 34,
  ringPower: 0.8,
  ringStun: 1.0,
  stop: 0.09,
  shake: [0.25, 3] as const,
  /** the slam and the whiff each settle over this many frames once she lands */
  recover: frame(6),
  slamRecover: frame(10),
} as const;

/** Wrecking Throw level 4: the suplex and Skyfall rings grow by this share and throw minions up */
export const AFTERSHOCK_SUPLEX = { ring: 1.5, launch: -220 } as const;
