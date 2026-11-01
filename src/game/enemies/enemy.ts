import { GROUND } from "../../constants/stage";
import type { Enemy, EnemyType } from "../../types/enemy";
import type { Box } from "../../types/world";
import { rng } from "../state";

export const enemyBox = (e: Enemy): Box =>
  e.type === "wisp" ? [e.x - 7, e.y - 7, e.x + 7, e.y + 7] : [e.x - 8, e.y - 26, e.x + 8, e.y];
export const enemyCenter = (e: Enemy): [number, number] => (e.type === "wisp" ? [e.x, e.y] : [e.x, e.y - 13]);

export function makeEnemy(type: EnemyType, x: number, y: number): Enemy {
  const base = {
    x,
    vx: 0,
    vy: 0,
    st: 0,
    face: -1,
    flash: 0,
    frozen: 0,
    burn: 0,
    burnTick: 0,
    shock: 0,
    seed: rng.range(0, 9),
    swing: -1,
  };
  return type === "wisp"
    ? { ...base, type, y, hp: 34, max: 34, state: "drift", cd: rng.range(0.6, 1.6), side: rng.chance(0.5) ? 1 : -1 }
    : { ...base, type, y: GROUND, hp: 72, max: 72, state: "walk", cd: 0.8, side: 1 };
}
