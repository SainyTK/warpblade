/**
 * Kill bursts thin out when many foes fall at once, so a crowd cleared in one blow stays readable and cheap to draw:
 * recent kills fade with a half-life of `halfLife` seconds; while fewer than `full` are recent each burst is whole,
 * past that it shrinks with their count, down to `least` of its particles. Bosses always burst whole.
 */
export const KILL_BURST = { halfLife: 0.25, full: 3, least: 0.2 } as const;
