export const SENTINEL = {
  pace: 14,
  stand: 20,
  reach: 46,
  raise: 0.9,
  fall: 0.11,
  slam: 0.32,
  stuck: 1.25,
  pull: 0.35,
  wave: { speed: 120, life: 0.85, height: 9, half: 5 },
} as const;

export const SENTINEL_HITS = { slam: 18, wave: 12, touch: 8 } as const;

export const HALBERD = { head: 27, butt: 7 } as const;
