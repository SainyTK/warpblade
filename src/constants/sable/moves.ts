import { frame } from "../hero";

/** I: a hop back that looses a bolt at the top, still facing the foe; free, on its own recharge */
export const HOP = {
  /** seconds the hop takes to come back, cut by spell haste */
  recharge: 2,
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

/** I held on the hop: a low slide forward along the floor, under blows, on the hop's recharge */
export const SLIDE = {
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
