import { GROUND } from "../../../../constants/stage";

export const COLOSSUS_HITS = { slam: 28, touch: 8 } as const;
export const SLAM = { windup: 1.05, hold: 0.28, recover: 1.5, near: 44, reach: 70, speed: 170, floor: GROUND } as const;
export const CALL = { windup: 0.9, recover: 0.6, near: 60, far: 150, every: 7, most: 2 } as const;
export const STRIDE = { speed: 17, keep: 30 } as const;
export const OPEN_CORE = 1.35;
