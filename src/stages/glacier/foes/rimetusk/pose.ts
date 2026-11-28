import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import type { Pt } from "../shapes";
import { TUSK } from "./constants";
import { isDazed } from "./recovery";

export interface TuskPose {
  lift: number;
  head: number;
  toss: number;
  front: readonly [Pt, Pt];
  hind: readonly [Pt, Pt];
  sheen: number;
  glare: boolean;
  dazed: boolean;
  jolt: number;
}

const STAND: Pick<TuskPose, "front" | "hind"> = {
  front: [
    [12, 0],
    [9, 0],
  ],
  hind: [
    [-12, 0],
    [-9, 0],
  ],
};

export function tuskPose(e: Enemy, time: number): TuskPose {
  const jolt = e.flash > 0 ? -1 : 0;
  const base = { lift: 0, head: 0, toss: 0, sheen: 0, glare: false, dazed: false, jolt, ...STAND };
  if (e.state === "wind") {
    const u = clamp(e.st / TUSK.wind);
    const paw = Math.floor(time * 10) % 2;
    return {
      ...base,
      head: 2 + u * 2,
      lift: 0.5,
      front: [
        [paw ? 15 : 12, paw ? -2 : 0],
        [9, 0],
      ],
      hind: [
        [-14, 0],
        [-11, 0],
      ],
      sheen: u,
      glare: u > 0.3,
    };
  }
  if (e.state === "charge") {
    const f = Math.floor(time * 16) % 2;
    return {
      ...base,
      head: 4,
      lift: f ? -1.5 : 0,
      front: f
        ? [
            [18, -2],
            [14, 0],
          ]
        : [
            [12, 0],
            [16, -1],
          ],
      hind: f
        ? [
            [-17, 0],
            [-12, -1],
          ]
        : [
            [-11, -1],
            [-16, 0],
          ],
      sheen: 1,
      glare: true,
    };
  }
  if (e.state === "hop") {
    const u = clamp(e.st / TUSK.toss);
    return { ...base, head: 3 + u * 2, lift: u, glare: u > 0.4, toss: -u * 0.4 };
  }
  if (e.state === "swipe") return { ...base, head: -4, lift: -1.5, toss: 1, glare: true };
  if (e.state === "recover" && isDazed(e)) return { ...base, head: 3, lift: 1, dazed: true };
  if (e.state === "recover") return { ...base, head: 1, lift: 0.5 };
  const gait = Math.floor(time * 5) % 4;
  const step = [2, 1, -2, -1][gait];
  return {
    ...base,
    lift: gait % 2 ? -0.5 : 0,
    front: [
      [11 + step, 0],
      [11 - step, 0],
    ],
    hind: [
      [-11 - step, 0],
      [-11 + step, 0],
    ],
  };
}
