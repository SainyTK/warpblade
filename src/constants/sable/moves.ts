import { frame } from "../hero";

/** K: a front kick that throws foes away from her */
export const KICK = {
  dur: frame(11),
  hit: frame(4),
  /** the box ahead of her the boot reaches, pixels from her feet */
  box: [2, -20, 20, -4] as const,
  power: 0.55,
  kx: 250,
  ky: -60,
  stun: 0.5,
  /** a kick that lands in the air springs her up and back off the foe */
  airSpring: 34,
  airPush: 70,
} as const;

/** L: a hop back that looses a bolt at the top, still facing the foe */
export const HOP = {
  cost: 22,
  /** pixels it rises */
  rise: 16,
  speed: 150,
  /** on the floor she crouches this long to load before she pushes off; from the air she pushes off at once */
  load: frame(3),
  /** nothing touches her for this long from the press */
  guard: 0.32,
  /** she looses the bolt this long into the hop, five frames after the push off */
  shot: frame(8),
  /** the landing crouch before she is free again */
  recover: frame(5),
  /** the hop's clip: the air key it holds until it lands, and where the landing starts */
  air: frame(11),
  land: frame(13),
} as const;

/** L with the side ahead held: a low slide along the floor, under blows */
export const SLIDE = {
  cost: 18,
  speed: 210,
  /** she plants and drops this long before the glide */
  load: frame(2),
  /** seconds she glides before she rises */
  time: 0.3,
  /** nothing touches her for this long from the press */
  guard: 0.35,
  /** the rise out of the slide */
  recover: frame(6),
} as const;

/** her jump, a little lower than Kael's and with no double jump */
export const SABLE_JUMP_RISE = 56;
