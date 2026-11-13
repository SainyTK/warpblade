/** U: Hour of Stillness, a clock face round her that stops every foe inside, then tolls */
export const HOUR = {
  /** anticipation with the staff raised */
  windup: 0.2,
  /** seconds the foes inside stay stopped, and the hands take to sweep */
  stop: 1.2,
  /** share of the damage a foe took while stopped added to the toll, capped at this many times the level's power */
  stored: 0.3,
  cap: 2,
  /** the radius of the Stillfield its upgrade leaves where it tolled */
  field: 50,
} as const;
