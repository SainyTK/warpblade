import type { GatorPose } from "./pose";

export type Point = [number, number];

export const add = (a: Point, b: Point, k = 1): Point => [a[0] + b[0] * k, a[1] + b[1] * k];
export const toward = (angle: number): Point => [Math.cos(angle), Math.sin(angle)];
export const across = (angle: number): Point => [-Math.sin(angle), Math.cos(angle)];

export const liftAt = (p: GatorPose, x: number): number => p.crouch - p.rear * Math.min(1, Math.max(0, (x + 10) / 22));

export const at = (p: GatorPose, x: number, y: number): Point => [x + p.lean, y + liftAt(p, x)];

export const TORSO = [
  [-9, -7.5, 5.8],
  [-2, -8.6, 7],
  [5, -8.8, 6.2],
] as const;

export const NECK_X = 11;
export const SKULL = 16;
export const JAW = 14;

export function bodySpan(x: number, face: number, back: number, front: number): [number, number] {
  const tail = x - face * back;
  const nose = x + face * front;
  return [Math.min(tail, nose), Math.max(tail, nose)];
}
