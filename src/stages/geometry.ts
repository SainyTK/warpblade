import { GROUND } from "../constants/stage";
import type { Patrol } from "../types/campaign";
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
export const boss = (foe: EnemyType) => ({ kind: "boss" as const, foe });
export const surge = (count: number, cap: number, foes?: readonly EnemyType[]) => ({
  kind: "surge" as const,
  count,
  cap,
  foes,
});
