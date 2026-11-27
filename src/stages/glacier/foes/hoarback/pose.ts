import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import type { Pt } from "../shapes";
import { HOARBACK } from "./constants";

export interface HoarbackPose {
  lift: number;
  rear: number;
  head: number;
  front: readonly [Pt, Pt];
  hind: readonly [Pt, Pt];
  hornGlow: number;
  glare: boolean;
}

export function hoarbackPose(e: Enemy, time: number): HoarbackPose {
  if (e.stagger > 0)
    return {
      lift: -1,
      rear: 0,
      head: 2,
      front: [
        [9, 0],
        [6, 0],
      ],
      hind: [
        [-9, 0],
        [-6, 0],
      ],
      hornGlow: 0,
      glare: false,
    };
  if (e.state === "wind") {
    const u = clamp(e.st / HOARBACK.wind);
    const scrape = Math.floor(time * 14) % 2;
    return {
      lift: 0,
      rear: u * 2.5,
      head: 1 + u * 1.5,
      front: [
        [10 + scrape, 0],
        [7, 0],
      ],
      hind: [
        [-10, 0],
        [-7 - scrape * 2, 0],
      ],
      hornGlow: u,
      glare: u > 0.35,
    };
  }
  if (e.state === "charge") {
    const f = Math.floor(time * 18) % 2;
    return {
      lift: -1,
      rear: -1.5,
      head: 2.5,
      front: [
        [f ? 13 : 9, f ? -1.5 : 0],
        [f ? 8 : 12, 0],
      ],
      hind: [
        [f ? -12 : -8, 0],
        [f ? -7 : -11, f ? -1 : 0],
      ],
      hornGlow: 1,
      glare: true,
    };
  }
  if (e.state === "recover")
    return {
      lift: 0.5,
      rear: 0,
      head: 1,
      front: [
        [9, 0],
        [7, 0],
      ],
      hind: [
        [-8, 0],
        [-6, 0],
      ],
      hornGlow: 0,
      glare: false,
    };
  const gait = Math.floor(time * 6) % 4;
  const step = [1.5, 0.5, -1.5, -0.5][gait];
  return {
    lift: gait % 2 ? -0.5 : 0,
    rear: 0,
    head: 0,
    front: [
      [8 + step, 0],
      [8 - step, 0],
    ],
    hind: [
      [-8 - step, 0],
      [-8 + step, 0],
    ],
    hornGlow: 0,
    glare: false,
  };
}
