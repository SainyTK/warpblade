import { GROUND } from "../../../constants/stage";
import type { EnemyType } from "../../../types/enemy";
import type { Platform, Point } from "../../../types/world";

interface Patrol extends Point {
  kind: "ground" | "flyer";
  type?: EnemyType;
  elite?: boolean;
}

export interface Approach {
  tier: number;
  threat: number;
  boss: EnemyType;
  par: number;
  length: number;
  slabs: readonly Platform[];
  walls: readonly [Platform, ...Platform[]];
  arena: readonly Platform[];
  patrol: readonly Patrol[];
  mentorSites: readonly Point[];
  spikes: readonly Platform[];
}

export const ledge = (x0: number, x1: number, y = GROUND): Platform => ({ x0, x1, y });
export const site = (x: number, y = GROUND): Point => ({ x, y });
export const walker = (x: number, elite = false, type?: EnemyType): Patrol => ({
  x,
  y: GROUND,
  kind: "ground",
  elite,
  type,
});
export const flyer = (x: number, y: number, type?: EnemyType): Patrol => ({ x, y, kind: "flyer", type });
