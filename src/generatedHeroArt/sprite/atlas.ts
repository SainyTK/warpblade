export type Rect = readonly [number, number, number, number];

export const ATLAS_SIZE = [265, 112] as const;

export const PARTS = {
  head: [0, 0, 60, 56],
  torso: [60, 0, 48, 48],
  upperArm: [108, 0, 18, 30],
  forearm: [126, 0, 19, 32],
  thigh: [145, 0, 20, 34],
  shin: [165, 0, 18, 31],
  foot: [183, 0, 22, 16],
  coat: [205, 0, 34, 48],
  scarfKnot: [108, 34, 31, 16],
  scarfTail: [139, 34, 25, 53],
  ponytail: [164, 34, 32, 48],
  sword: [239, 0, 26, 96],
  rearHead: [0, 56, 60, 56],
  rearTorso: [60, 56, 48, 48],
} as const satisfies Record<string, Rect>;
