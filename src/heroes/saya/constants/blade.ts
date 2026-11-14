/**
 * Saya's blade states, the pose key `bs`: the katana drawn in her hand, sheathed in the scabbard at her hip, or held
 * sheathed across her body in both hands for the guard. A clip keys the change with a snap on the frame it happens.
 */
export const BLADE_STATE = { drawn: 0, sheathed: 1, held: 2 } as const;

/** the blade state a pose's `bs` reads as: the nearest of the three */
export const bladeStateOf = (bs: number): number => Math.round(Math.min(2, Math.max(0, bs)));

/** the katana, from the hand: the grip behind it, the guard, the collar and the blade with its curve */
export const KATANA = {
  /** from the hand to the point, in pixels */
  reach: 19,
  /** where the blade leaves the collar */
  root: 2.6,
  /** the grip runs back to here, and the pommel cap sits at its end */
  grip: -4.4,
  /** the round guard's radius and where it sits along the hilt */
  guard: 1.7,
  guardAt: 1.5,
  /** how far the point bends toward the back of the blade */
  curve: 1.1,
} as const;

/**
 * The scabbard at her left hip, in pixels across and down the waist from the hip (`atHip`): its mouth at the front of
 * the belt and its end behind and below. A sheathed katana's hilt rises forward out of the mouth.
 */
export const SCABBARD = {
  mouth: [3.2, -0.8],
  end: [-13.5, 4.6],
} as const;
