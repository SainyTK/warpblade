export const KNIGHT = {
  pace: 18,
  keep: 30,
  cleaveReach: 50,
  bashReach: 120,
  cleaveWind: 0.95,
  cleaveFrom: 2,
  cleaveTo: 40,
  cleaveTime: 0.3,
  bashWind: 0.8,
  bashSpeed: 190,
  bashTime: 0.5,
  recover: 1.15,
} as const;

export const KNIGHT_HITS = { cleave: 17, bash: 15, touch: 7 } as const;

export const KNIGHT_MOVE = { cleave: 1, bash: 2 } as const;
