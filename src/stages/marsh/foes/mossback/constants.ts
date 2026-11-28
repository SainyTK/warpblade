export const SNAP = {
  walk: 12,
  near: 18,
  snapRange: 38,
  slamFrom: 30,
  slamTo: 64,
  draw: 0.62,
  out: 0.07,
  hold: 0.14,
  back: 0.36,
  reach: 30,
  crouch: 0.72,
  flight: 0.5,
  gravity: 820,
  hopMost: 70,
  land: 0.32,
  splash: 24,
  recover: 0.85,
} as const;

export const SNAP_MOVE = { bite: 0, slam: 1 } as const;
