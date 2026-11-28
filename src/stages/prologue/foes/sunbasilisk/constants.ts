export const BASILISK = {
  pace: 15,
  stand: 30,
  near: 42,
  behind: 46,
  gazeRange: 230,
  eye: { x: 27, y: -17 },
  gaze: 1.15,
  lock: 0.72,
  beam: 0.42,
  beamLive: 0.3,
  beamHalf: 4.5,
  gazeRest: 1.4,
  coil: 0.55,
  lash: 0.32,
  lashFrom: 0.06,
  lashTo: 0.24,
  lashReach: 46,
  lashRest: 0.8,
  rear: 0.6,
  bite: 0.24,
  biteSpeed: 190,
  biteRest: 1.25,
} as const;

export const BASILISK_MOVE = { gaze: 0, lash: 1, bite: 2 } as const;

export const BASILISK_HITS = { gaze: 28, lash: 22, bite: 26, touch: 10 } as const;
