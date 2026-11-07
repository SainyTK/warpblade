/**
 * Kill bursts thin out when many foes fall at once, so a crowd cleared in one blow stays readable and cheap to draw:
 * recent kills fade with a half-life of `halfLife` seconds; while fewer than `full` are recent each burst is whole,
 * past that it shrinks with their count, down to `least` of its particles. Bosses always burst whole.
 * Their light is capped: the bursts' glow, fading with the same half-life, never adds up past `light`, one boss burst's
 * worth and a little, so one kill shines whole and many at once never wash the screen white.
 */
export const KILL_BURST = { halfLife: 0.25, full: 3, least: 0.2, light: 1 } as const;
