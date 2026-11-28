import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { CALL, SLAM } from "./constants";

type Pt = readonly [number, number];

export interface ColossusPose {
  lean: number;
  bob: number;
  step: number;
  far: Pt;
  near: Pt;
  core: number;
  open: number;
  dip: number;
}

const REST_FAR: Pt = [-9, -14];
const REST_NEAR: Pt = [12, -13];
const mixPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export function colossusPose(e: Enemy, time: number): ColossusPose {
  const scale = waveScale(game.wave).windup;
  if (e.state === "wind") {
    const u = clamp(e.st / (SLAM.windup * scale));
    const lift = Math.sin(Math.min(1, u * 1.3) * (Math.PI / 2));
    const tremble = u > 0.75 ? Math.sin(time * 70) * 0.4 : 0;
    return {
      lean: -2.5 * lift + tremble,
      bob: -lift,
      step: 0,
      far: mixPt(REST_FAR, [-3, -52], lift),
      near: mixPt(REST_NEAR, [5, -54], lift),
      core: 0.3 + u * 0.7,
      open: 0,
      dip: 0,
    };
  }
  if (e.state === "swipe") return { lean: 3, bob: 2, step: 0, far: [-6, -3], near: [12, -3], core: 1, open: 0, dip: 1 };
  if (e.state === "recover") {
    const u = clamp(e.st / SLAM.recover);
    const rise = clamp((u - 0.6) / 0.4);
    return {
      lean: lerp(2.5, 0, rise),
      bob: lerp(1.5, 0, rise),
      step: 0,
      far: mixPt([-7, -4], REST_FAR, rise),
      near: mixPt([12, -4], REST_NEAR, rise),
      core: 0.15,
      open: 1 - rise,
      dip: lerp(2, 0, rise),
    };
  }
  if (e.state === "summon") {
    const u = clamp(e.st / (CALL.windup * scale));
    return {
      lean: -1.5 * u,
      bob: 0,
      step: 0,
      far: REST_FAR,
      near: mixPt(REST_NEAR, [7, -58], Math.min(1, u * 1.6)),
      core: 0.4 + 0.6 * (Math.sin(time * 30) > 0 ? u : 0),
      open: 0,
      dip: 0,
    };
  }
  const walking = Math.abs(e.vx) > 3;
  const step = walking ? Math.sin(time * 4.2) : 0;
  const swing = step * 2;
  return {
    lean: walking ? 0.8 : 0,
    bob: walking ? Math.abs(step) * 0.8 : Math.sin(time * 1.6) * 0.3,
    step,
    far: [REST_FAR[0] + swing, REST_FAR[1]],
    near: [REST_NEAR[0] - swing, REST_NEAR[1]],
    core: 0.3 + Math.sin(time * 3) * 0.1,
    open: 0,
    dip: 0,
  };
}
