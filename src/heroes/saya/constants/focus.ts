/**
 * Focus, Saya's breaths: one fills every `rest` seconds while the blade rests; a parry, a perfect dodge and a clean
 * sheathe each give one. Each draw cut and falling draw spends one when she has it, and reaches farther and stores more.
 */
export const FOCUS = {
  max: 3,
  rest: 1.4,
  /** px a breath adds to the draw's reach, and the factor on what it stores */
  reach: 14,
  store: 1.6,
  /** seconds the bar flashes after a breath is spent */
  flash: 0.25,
} as const;

/** the Focus bar's label and colour on the HUD */
export const FOCUS_BAR = { label: "FO", tint: "#dfe5ff" } as const;
