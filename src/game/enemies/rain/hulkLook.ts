import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp } from "../../../utils/math";
import { hulkGathered } from "./hulkGathered";
import { cracked, HULK_TIMES, lying, RISE, RUSH, SINKING } from "./hulkMoves";

export type Point = [number, number];

export interface HulkLook {
  time: number;
  step: number;
  gathered: number;
  hot: boolean;
  crouch: number;
  drop: number;
  rear: number;
  near: Point;
  far: Point;
  cracked: boolean;
  droop: number;
  dim: boolean;
  warning: number;
  sunk: number;
}

const blend = (a: Point, b: Point, u: number): Point => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

function restingFists(step: number): [Point, Point] {
  return [
    [12, -4 - step],
    [6, -4 + step],
  ];
}

function attackFists(e: Enemy, step: number, u: number): [Point, Point] {
  switch (e.state) {
    case "wind":
      return [
        [4 - u * 4, -30 - u * 14],
        [-2 - u * 4, -30 - u * 12],
      ];
    case "swipe":
      return [
        [26, -3],
        [21, -3],
      ];
    case "charge":
      return [
        [-6 - u * 10, -3],
        [-10 - u * 8, -4],
      ];
    case "volley":
      return [
        [-4 - u * 8, -32 - u * 10],
        [6, -6],
      ];
    case "shoot":
      return e.st < 0.2
        ? [
            [24, -12],
            [18, -6],
          ]
        : [
            [16, -6],
            [10, -5],
          ];
    case "dive": {
      const [near, far] = restingFists(0);
      return [blend(near, [0, -3], u), blend(far, [-12, -3], u)];
    }
    default:
      return restingFists(step);
  }
}

function sinkingDrop(e: Enemy): number {
  if (e.state === "burrow") return SINKING.drop * ease.outCubic(clamp(e.st / SINKING.settle));
  if (e.state !== "hop") return 0;
  if (e.st < RISE.pop) return lerp(SINKING.drop, -RISE.overshoot, e.st / RISE.pop);
  return lerp(-RISE.overshoot, 0, ease.outQuad(clamp((e.st - RISE.pop) / (HULK_TIMES.rise - RISE.pop))));
}

function warning(e: Enemy): number {
  if (e.state !== "burrow") return 0;
  return clamp(1 - (HULK_TIMES.sink - e.st) / SINKING.warn);
}

export function hulkLook(e: Enemy, t: number): HulkLook {
  const time = t + e.seed;
  const step = e.state === "walk" ? (Math.floor(time * 3) % 2) * 2 - 1 : 0;
  const gathered = hulkGathered(e);
  const hot = gathered > 0;
  const drop = sinkingDrop(e);
  const settle = e.state === "burrow" ? ease.outCubic(clamp(e.st / SINKING.settle)) : 0;
  const [near, far] = attackFists(e, step, gathered);
  const floor = -drop - 3;
  return {
    time,
    step,
    gathered,
    hot,
    crouch: e.state === "swipe" ? 2 : hot ? gathered * 1.5 : 0,
    drop,
    rear: e.state === "dive" ? -RUSH.rearBack * gathered : 0,
    near: blend(near, [16, floor], settle),
    far: blend(far, [-17, floor], settle),
    cracked: cracked(e),
    droop: 1 + settle,
    dim: e.state === "burrow" || (e.state === "recover" && lying(e)),
    warning: warning(e),
    sunk: settle,
  };
}
