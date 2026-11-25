import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { SMITH_TIMES } from "./behavior";

export type Pt = readonly [number, number];

export interface SmithPose {
  hand: Pt;
  head: Pt;
  reach: Pt;
  ingot: boolean;
  crouch: number;
  lean: number;
  bellows: number;
  heat: number;
  mouth: number;
  anvil: number;
  step: number;
  cracked: boolean;
  burst: number;
}

const mixPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

const REST = { hand: [13, -27] as Pt, head: [26, -4] as Pt, reach: [-9, -26] as Pt };
const RAISED = { hand: [3, -66] as Pt, head: [-11, -84] as Pt };
const STRUCK = { hand: [17, -24] as Pt, head: [31, -5] as Pt };
const OVERHEAD = { hand: [6, -70] as Pt, head: [7, -94] as Pt };
const ANVIL_TAP = { hand: [-6, -40] as Pt, head: [-24, -26] as Pt };

function base(e: Enemy, time: number): SmithPose {
  const walking = e.state === "walk" && Math.abs(e.vx) > 3;
  const step = walking ? Math.sin(time * 4.2) : 0;
  const breathe = Math.sin(time * 2) * 0.5;
  return {
    hand: [REST.hand[0], REST.hand[1] + breathe],
    head: [REST.head[0] + step, REST.head[1]],
    reach: [REST.reach[0], REST.reach[1] + breathe],
    ingot: false,
    crouch: Math.abs(step) * 0.8 + breathe * 0.4,
    lean: 0,
    bellows: 0.3 + breathe * 0.2,
    heat: 0,
    mouth: 0.3,
    anvil: 0,
    step,
    cracked: e.phase >= 2,
    burst: 0,
  };
}

export function smithPose(e: Enemy, t: number): SmithPose {
  const time = t + e.seed;
  const p = base(e, time);
  const st = e.st;
  if (e.state === "charge") {
    const wind = e.n > 0 ? SMITH_TIMES.quickSlam : SMITH_TIMES.slam;
    const u = ease.outCubic(clamp(st / (wind * 0.6)));
    return {
      ...p,
      hand: mixPt(REST.hand, RAISED.hand, u),
      head: mixPt(REST.head, RAISED.head, u),
      crouch: -u * 2,
      lean: -u * 2,
      heat: clamp(st / wind),
      mouth: 0.5,
    };
  }
  if (e.state === "swipe") {
    const u = clamp(st / SMITH_TIMES.smash);
    return { ...p, hand: STRUCK.hand, head: STRUCK.head, crouch: 4 - u * 2, lean: 3, heat: 1 - u * 0.6, mouth: 0.8 };
  }
  if (e.state === "volley") {
    const u = ease.outCubic(clamp(st / SMITH_TIMES.volley));
    return { ...p, reach: mixPt(REST.reach, [-24, -14], u), ingot: u > 0.5, lean: -u * 2, crouch: u * 2, anvil: u };
  }
  if (e.state === "shoot") {
    const u = clamp(st / SMITH_TIMES.throw);
    return { ...p, reach: mixPt([-18, -46], [16, -60], ease.outCubic(Math.min(1, u * 3))), lean: 2, mouth: 0.6 };
  }
  if (e.state === "wind") {
    const u = clamp(st / SMITH_TIMES.warm);
    return {
      ...p,
      bellows: 1 - u * 0.2 + Math.sin(time * 30) * 0.05,
      lean: -u * 3,
      crouch: -u,
      heat: u * 0.5,
      mouth: 0.4 + u * 0.6,
    };
  }
  if (e.state === "beam") {
    const u = clamp(st / SMITH_TIMES.burn);
    return { ...p, bellows: 0.8 - u * 0.75, lean: 3, crouch: 1, mouth: 1 };
  }
  if (e.state === "summon") {
    const u = clamp(st / SMITH_TIMES.summon);
    const strike = u > 0.75 ? 1 : 0;
    const lift = ease.outCubic(clamp(u / 0.75));
    return {
      ...p,
      hand: strike ? ANVIL_TAP.hand : mixPt(REST.hand, [0, -54], lift),
      head: strike ? ANVIL_TAP.head : mixPt(REST.head, [-8, -70], lift),
      anvil: u,
      lean: -2,
      heat: u,
    };
  }
  if (e.state === "hop") {
    const u = ease.outCubic(clamp(st / SMITH_TIMES.roar));
    return {
      ...p,
      hand: mixPt(REST.hand, OVERHEAD.hand, u),
      head: mixPt(REST.head, OVERHEAD.head, u),
      reach: mixPt(REST.reach, [-14, -64], u),
      crouch: -u * 3,
      heat: u,
      mouth: 1,
      bellows: 0.9,
    };
  }
  if (e.state === "burrow") {
    const u = clamp(st / SMITH_TIMES.crack);
    return {
      ...p,
      crouch: 6 * Math.sin(Math.PI * Math.min(1, u * 1.4)),
      reach: [-16, -46],
      hand: [16, -40],
      head: [28, -52],
      burst: u,
      mouth: 1,
      heat: 1,
    };
  }
  if (e.state === "recover") {
    const u = clamp(st / SMITH_TIMES.recover);
    return {
      ...p,
      hand: mixPt(STRUCK.hand, REST.hand, u),
      head: mixPt(STRUCK.head, REST.head, u),
      crouch: 2 * (1 - u),
    };
  }
  return p;
}
