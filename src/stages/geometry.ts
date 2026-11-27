import { GROUND } from "../constants/stage";
import type { Patrol, SurgeRoom } from "../types/campaign";
import type { EnemyType } from "../types/enemy";
import type { Platform, Point } from "../types/world";

export const ledge = (x0: number, x1: number, y = GROUND): Platform => ({ x0, x1, y });
export const pit = (x0: number, x1: number): Platform => ({ x0, x1, y: GROUND });
export const site = (x: number, y = GROUND): Point => ({ x, y });
export const walker = (x: number, elite = false, type?: EnemyType): Patrol => ({
  x,
  y: GROUND,
  kind: "ground",
  elite,
  type,
});
export const flyer = (x: number, y: number, type?: EnemyType): Patrol => ({ x, y, kind: "flyer", type });
export const surge = (cap: number, foes?: readonly EnemyType[]): SurgeRoom => ({
  cap,
  foes,
});
