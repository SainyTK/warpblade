import type { Enemy } from "../../types/enemy";
import type { Platform } from "../../types/world";
import { stageWalls } from "./trail";

const CLEARANCE = 8;

function wallLimit(wall: Platform, previousX: number, x: number): number {
  const left = wall.x0 - CLEARANCE;
  const right = wall.x1 + CLEARANCE;
  if (previousX <= left) return Math.min(x, left);
  if (previousX >= right) return Math.max(x, right);
  if (x <= left || x >= right) return x;
  return previousX <= (left + right) / 2 ? left : right;
}

export function containPatrol(e: Enemy, previousX: number): void {
  let x = e.x;
  for (const wall of stageWalls()) {
    if (e.y > wall.y) x = wallLimit(wall, previousX, x);
  }
  if (x === e.x) return;
  e.x = x;
  e.vx = 0;
  if (e.type === "thornback" && e.state === "lunge") {
    e.state = "recover";
    e.st = 0;
  }
}
