import { GROUND } from "../../../../constants/stage";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { Box } from "../../../../types/world";
import { clamp, ease } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SNAP, SNAP_MOVE } from "./constants";

export const drawTime = (): number => SNAP.draw * waveScale(game.wave).windup;
export const crouchTime = (): number => SNAP.crouch * waveScale(game.wave).windup;

export const drawingBack = (e: Enemy): boolean => e.state === "wind" && e.n === SNAP_MOVE.bite;
export const crouching = (e: Enemy): boolean => e.state === "wind" && e.n === SNAP_MOVE.slam;
export const snapping = (e: Enemy): boolean => e.state === "lunge";
export const airborne = (e: Enemy): boolean => e.state === "leap";
export const landing = (e: Enemy): boolean => e.state === "swipe";

export function neckReach(e: Enemy): number {
  if (drawingBack(e)) return -4 * ease.outCubic(clamp(e.st / drawTime()));
  if (!snapping(e)) return 0;
  if (e.st < SNAP.out) return SNAP.reach * (e.st / SNAP.out);
  if (e.st < SNAP.out + SNAP.hold) return SNAP.reach;
  return SNAP.reach * clamp(1 - (e.st - SNAP.out - SNAP.hold) / (SNAP.back - SNAP.out - SNAP.hold));
}

export function biteBox(e: Enemy): Box {
  const tip = e.x + e.face * (16 + neckReach(e));
  return [Math.min(e.x + e.face * 8, tip) - 2, e.y - 11, Math.max(e.x + e.face * 8, tip) + 2, e.y - 3];
}

export function mossbackBox(e: Enemy): Box {
  if (crouching(e)) return [e.x - 14, e.y - 13, e.x + 14, e.y];
  return [e.x - 14, e.y - 17, e.x + 14, e.y];
}

export const mossbackCenter = (e: Enemy): [number, number] => [e.x, e.y - (crouching(e) ? 7 : 9)];

export const onFloor = (e: Enemy): boolean => e.y >= GROUND;
