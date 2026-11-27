export const MINI_SIGNATURE = { every: [6.5, 4.5], telegraph: 0.75 } as const;

export const MINI_MOVES = {
  pillars: { count: 3, enraged: 5, gap: 30, beat: 0.12, hit: 16 },
  spikes: { count: 5, enraged: 7, start: 16, hit: 14 },
  call: { count: 2, enraged: 3, spread: 70, xpShare: 0.25 },
} as const;

export const MINI_RING = { width: 2, pulse: 6 } as const;
