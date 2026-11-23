import type { Enemy } from "../../../types/enemy";

export interface RushPath {
  owner: Enemy;
  from: number;
  to: number;
  dir: number;
  windup: number;
}

const current = new WeakMap<Enemy, RushPath>();

export function beginRush(path: RushPath): void {
  current.set(path.owner, path);
}

export const rushing = (path: RushPath): boolean =>
  current.get(path.owner) === path &&
  path.owner.hp > 0 &&
  (path.owner.state === "dive" || path.owner.state === "lunge");
