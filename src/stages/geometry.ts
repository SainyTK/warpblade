import { GROUND } from "../constants/stage";
import type { LadderFoe, Pack, Patrol } from "../types/campaign";
import type { EnemyType } from "../types/enemy";
import type { Platform, Point } from "../types/world";

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
export const pack = (hold: number, ...foes: [Patrol, ...Patrol[]]): Pack => ({ hold, foes });
export const rung = (level: number, hits: number, ...foes: EnemyType[]): LadderFoe[] =>
  foes.map((foe) => ({ foe, level, hits }));
