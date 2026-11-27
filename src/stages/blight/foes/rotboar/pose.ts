import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BOAR_TIMES } from "./moves";

export type Pt = readonly [number, number];

export interface BoarPose {
  bob: number;
  lean: number;
  head: number;
  rump: number;
  front: readonly [Pt, Pt];
  hind: readonly [Pt, Pt];
  tail: number;
  charge: number;
  dazed: boolean;
}

function pawing(e: Enemy, time: number): BoarPose {
  const k = clamp(e.st / (BOAR_TIMES.paw * waveScale(game.wave).windup));
  const scrape = Math.sin(e.st * Math.PI * 6);
  return {
    bob: 0.5 + Math.abs(scrape) * 0.3,
    lean: -1,
    head: 2,
    rump: -1.5,
    front: [
      [10 + scrape * 3, -Math.max(0, scrape) * 1.5],
      [7, 0],
    ],
    hind: [
      [-10, 0],
      [-8, 0],
    ],
    tail: Math.sin(time * 30) * 1.2,
    charge: k,
    dazed: false,
  };
}

function galloping(time: number): BoarPose {
  const f = Math.floor(time * 16) % 2;
  return {
    bob: f ? -1 : 0,
    lean: 2,
    head: 1.5,
    rump: 0,
    front: f
      ? [
          [16, -2],
          [13, -1],
        ]
      : [
          [10, 0],
          [7, -2],
        ],
    hind: f
      ? [
          [-15, -1],
          [-12, -2],
        ]
      : [
          [-9, 0],
          [-6, -1],
        ],
    tail: -2,
    charge: 1,
    dazed: false,
  };
}

function skidding(e: Enemy, time: number): BoarPose {
  const dazed = e.stun > 0;
  return {
    bob: dazed ? 1 : 0.5,
    lean: dazed ? -1 : 0,
    head: dazed ? 2.5 + Math.sin(time * 5) * 0.5 : 0.5,
    rump: dazed ? 0 : 1,
    front: [
      [15, 0],
      [13, 0],
    ],
    hind: [
      [-8, 0],
      [-5, 0],
    ],
    tail: dazed ? 1 : -1,
    charge: 0,
    dazed,
  };
}

export function boarPose(e: Enemy, time: number, walking: boolean): BoarPose {
  if (e.state === "wind") return pawing(e, time);
  if (e.state === "lunge") return galloping(time);
  if (e.state === "recover") return skidding(e, time);
  const gait = walking ? Math.floor(time * 7) % 4 : 0;
  const step = walking ? [2, 1, -2, -1][gait] : 0;
  const lift = gait % 2 ? -1 : 0;
  return {
    bob: gait % 2 ? -0.5 : 0,
    lean: 0,
    head: walking ? 0 : Math.sin(time * 2) * 0.4,
    rump: 0,
    front: [
      [9 + step, lift],
      [9 - step, 0],
    ],
    hind: [
      [-9 - step, 0],
      [-9 + step, lift],
    ],
    tail: Math.sin(time * 6),
    charge: 0,
    dazed: false,
  };
}
