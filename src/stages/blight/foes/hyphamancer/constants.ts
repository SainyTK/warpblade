export const HYPHA = {
  pace: 19,
  near: 50,
  far: 104,
  reach: 165,
  raise: 0.75,
  lift: 0.5,
  root: 0.8,
  plant: 0.5,
  recover: 0.7,
  wardReach: 120,
  wardEvery: 8,
  links: 3,
} as const;

export const HYPHA_HITS = { root: 20, touch: 6 } as const;

export const ROOT_SPREAD = [
  [0, 0],
  [-11, 0.12],
  [11, 0.24],
] as const;
