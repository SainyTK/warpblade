import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SCRIVENER } from "./moves";

type Pt = readonly [number, number];

export interface ScrivenerPose {
  hand: Pt;
  nib: Pt;
  hunch: number;
  lean: number;
  glare: boolean;
  swirl: number;
}

export const QUILL_TIP = { raised: [9, -40] as Pt } as const;

const mixPt = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

const REST = { hand: [7, -17] as Pt, nib: [10, -9] as Pt };
const RAISED = { hand: [6, -31] as Pt, nib: QUILL_TIP.raised };

export function scrivenerPose(e: Enemy, time: number): ScrivenerPose {
  const windup = waveScale(game.wave).windup;
  if (e.stagger > 0 || e.stun > 0)
    return { hand: [5, -13], nib: [6, -5], hunch: 2, lean: -1.5, glare: false, swirl: 0 };
  if (e.state === "wind") {
    const k = clamp(e.st / (SCRIVENER.write * windup * 0.5));
    return {
      hand: mixPt(REST.hand, RAISED.hand, k),
      nib: mixPt(REST.nib, RAISED.nib, k),
      hunch: -1,
      lean: -1,
      glare: true,
      swirl: clamp(e.st / (SCRIVENER.write * windup)),
    };
  }
  if (e.state === "shoot") {
    const k = clamp(e.st / 0.12);
    return {
      hand: mixPt(RAISED.hand, [13, -10], k),
      nib: mixPt(RAISED.nib, [18, -1], k),
      hunch: 1,
      lean: 2,
      glare: true,
      swirl: 0,
    };
  }
  if (e.state === "charge") {
    const k = clamp(e.st / (SCRIVENER.stabWind * windup * 0.6));
    return {
      hand: mixPt(REST.hand, [-1, -20], k),
      nib: mixPt(REST.nib, [5, -20], k),
      hunch: 0,
      lean: -1.5 * k,
      glare: true,
      swirl: 0,
    };
  }
  if (e.state === "swipe") return { hand: [13, -18], nib: [24, -17], hunch: 0, lean: 2.5, glare: true, swirl: 0 };
  if (e.state === "recover") {
    const pant = Math.sin(time * 6) * 0.5;
    return { hand: [8, -11 + pant], nib: [11, -3 + pant], hunch: 2.5 + pant, lean: 1, glare: false, swirl: 0 };
  }
  const bob = Math.sin(time * 3) * 0.6;
  return {
    hand: [REST.hand[0], REST.hand[1] + bob],
    nib: [REST.nib[0], REST.nib[1] + bob],
    hunch: bob,
    lean: 0,
    glare: false,
    swirl: 0,
  };
}
