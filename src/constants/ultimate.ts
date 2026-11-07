/** Hold U: each level is reached after this many seconds, costs this much MP and hits this hard. */
export const ULT_LEVELS = [
  { at: 0, cost: 25, power: 2.5 },
  { at: 0.5, cost: 45, power: 4.5 },
  { at: 1.05, cost: 70, power: 7 },
  /** level 4 needs a full MP bar and spends all of it */
  { at: 1.7, cost: Number.POSITIVE_INFINITY, power: 14 },
] as const;
/** how far each level reaches: in front at 1 and 2, both sides at 3, the whole screen at 4 */
export const ULT_REACH = [80, 130, 170, Number.POSITIVE_INFINITY] as const;
/** seconds before an ultimate can be charged again: the longest wait of any ability, well past the slowest spell */
export const ULT_COOLDOWN = 20;
/** how long Kael is locked in the ultimate and cannot be hurt */
export const ULT_LOCK = 0.7;
/** the charge rule every ultimate shares, for their cards */
export const ULT_CHARGE =
  "Hold U to charge up to four levels, release to strike. Higher levels cost more MP; level 4 spends a full bar.";
