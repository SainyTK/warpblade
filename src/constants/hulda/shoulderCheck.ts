/**
 * Shoulder Check: foes her dodge passes are shouldered aside this hard. A minion it flips comes up `lift` pixels over
 * the floor, `behind` pixels behind her (each further flip of the dodge `spread` more), and drops into the floor at
 * `drop`, lying stunned `flipStun`, as do the foes the flip's ring strikes
 */
export const SHOULDER = {
  kx: 70,
  behind: 10,
  spread: 8,
  lift: 26,
  drop: 120,
  flipStun: 0.8,
  stop: 0.04,
  shake: [0.12, 1.8] as const,
} as const;
