import { GROUND } from "../../constants/stage";
import type { Platform, Point } from "../../types/world";
import { clamp } from "../../utils/math";
import { stageBounds, stagePlatforms, stageWalls } from "../adventure";

const EDGE = 8;
const BODY_RADIUS = 5;
const PLATFORM_REACH = 3;
const FLOOR_TOLERANCE = 0.01;
const WALL_REACH = 0.5;

export function clampHeroX(x: number, margin = EDGE): number {
  const { left, right } = stageBounds();
  const low = left + margin;
  return clamp(x, low, Math.max(low, right - margin));
}

export function safeHeroDestination(x: number, y: number): Point {
  const nx = clampHeroX(x);
  let ny = Math.min(y, GROUND);
  for (const wall of stageWalls()) {
    if (nx + BODY_RADIUS > wall.x0 && nx - BODY_RADIUS < wall.x1) {
      ny = Math.min(ny, wall.y);
    }
  }
  return { x: nx, y: ny };
}

export function wallSide(x: number, y: number): number {
  for (const wall of stageWalls()) {
    if (y <= wall.y) continue;
    if (Math.abs(x - (wall.x0 - BODY_RADIUS)) <= WALL_REACH) return 1;
    if (Math.abs(x - (wall.x1 + BODY_RADIUS)) <= WALL_REACH) return -1;
  }
  return 0;
}

export function moveHeroX(x: number, y: number, target: number): number {
  let nx = clampHeroX(target);
  for (const wall of stageWalls()) {
    if (y <= wall.y) continue;
    const left = wall.x0 - BODY_RADIUS;
    const right = wall.x1 + BODY_RADIUS;
    if (x <= left && nx > left) nx = left;
    if (x >= right && nx < right) nx = right;
  }
  return nx;
}

function abovePlatform(x: number, p: Platform): boolean {
  return x >= p.x0 - PLATFORM_REACH && x <= p.x1 + PLATFORM_REACH;
}

export function oneWayAt(x: number, y: number): Platform | undefined {
  return stagePlatforms().find((p) => abovePlatform(x, p) && Math.abs(y - p.y) <= FLOOR_TOLERANCE);
}

export function landingAt(x: number, y: number, ny: number, drop: number, ignored: Platform | null): number | null {
  let floor = ny >= GROUND ? GROUND : Infinity;
  for (const wall of stageWalls()) {
    if (x + BODY_RADIUS > wall.x0 && x - BODY_RADIUS < wall.x1 && y <= wall.y + FLOOR_TOLERANCE && ny >= wall.y) {
      floor = Math.min(floor, wall.y);
    }
  }
  if (drop <= 0) {
    for (const p of stagePlatforms()) {
      if (p !== ignored && abovePlatform(x, p) && y <= p.y + FLOOR_TOLERANCE && ny >= p.y) {
        floor = Math.min(floor, p.y);
      }
    }
  }
  return Number.isFinite(floor) ? floor : null;
}
