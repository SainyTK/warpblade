/**
 * How each of her floor waves looks: the crest's height at the front, the width of the strike box behind the front, how
 * high above the floor it reaches foes, how long the cracks it leaves stay, and whether rubble flies off it.
 */
export const WAVE_LOOK = {
  shock: { crest: 7, width: 8, height: 26, crack: 0.25, rubble: 0.25 },
  rend: { crest: 11, width: 9, height: 34, crack: 0.3, rubble: 0.35 },
  fissure: { crest: 14, width: 10, height: 34, crack: 0.9, rubble: 0.6 },
} as const;
export type WaveKind = keyof typeof WAVE_LOOK;
