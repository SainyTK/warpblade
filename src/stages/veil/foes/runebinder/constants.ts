export const BINDER = {
  pace: 16,
  keep: 50,
  far: 100,
  bash: 28,
  sealWind: 0.7,
  seal: 1.05,
  bashWind: 0.62,
  shove: 0.22,
  recover: 1.25,
  radius: 18,
} as const;
export const BINDER_HITS = { seal: 20, bash: 20, touch: 8 } as const;
export const SEAL = 0;
export const BASH = 1;
