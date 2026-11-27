import { GROUND } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import type { Platform } from "../../types/world";
import { hero } from "../state";
import { stageWalls, trail } from "./trail";

const CLEARANCE = 8;
const PERCH_HEIGHT = 64;
const PERCH_NOTICE_HEIGHT = 54;
const CHEST_HEIGHT = 18;

export function markPerch(enemy: Enemy): void {
  if (enemy.rank === "minion" && enemy.y < GROUND - PERCH_HEIGHT) trail?.perched.set(enemy, enemy.y);
}

export function waitsOnPerch(enemy: Enemy): boolean {
  const altitude = trail?.perched.get(enemy);
  if (altitude === undefined) return false;
  if (enemy.hp >= enemy.max && hero.y - CHEST_HEIGHT - altitude > PERCH_NOTICE_HEIGHT) return true;
  trail?.perched.delete(enemy);
  return false;
}

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
