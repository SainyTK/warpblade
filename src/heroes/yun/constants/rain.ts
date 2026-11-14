/**
 * Jade Rain: spirit swords fall on the foes on screen, `perFoe` to a foe for at most `foes` foes, each sword a
 * `perFoe`th of the shared ultimate blow times `share`. They fall from `height` above the foe at `speed`, `gap` seconds
 * apart. With no foe on screen they fall on `empty` points ahead of Yun. Heaven's Grove's second rain falls
 * `againDelay` seconds later, and Endless Rain lets a sword fall every `lingerEvery` seconds on a foe within
 * `lingerReach` of him.
 */
export const RAIN = {
  perFoe: 3,
  foes: 6,
  share: 0.75,
  height: 110,
  speed: 520,
  gap: 0.06,
  empty: [24, 48, 72],
  againDelay: 0.6,
  lingerEvery: 0.25,
  lingerReach: 120,
} as const;
