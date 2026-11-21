import { pose } from "../../src/constants/hero";
import { toePoint } from "../../src/rig";
import { clamp, lerp } from "../../src/utils/math";
import type { Motion } from "./types";

const CYCLE = 0.52;
const STRIDE = 50;
const RELEASE = 0.35;
const CONTACT = 9.8;
const TAU = 2 * Math.PI;

const pelvis = [
  [0, -10.5],
  [0.07, -8.55],
  [0.16, -9.25],
  [0.27, -11.45],
  [RELEASE, -12.45],
  [0.43, -13.2],
  [0.5, -10.5],
] as const;

const lean = [
  [0, 6],
  [0.07, 7.65],
  [0.16, 7.3],
  [0.29, 6.1],
  [0.42, 5.6],
  [0.5, 6],
] as const;

const swing = [
  [RELEASE, CONTACT - STRIDE * RELEASE, -1.65, 0.76],
  [0.43, -11.6, -5, 0.98],
  [0.52, -10.5, -7.3, 1.08],
  [0.61, -6, -10.4, 1.12],
  [0.72, 2.1, -9.2, 0.7],
  [0.82, 8.6, -7.4, 0.29],
  [0.91, 12.2, -5.6, -0.02],
  [0.96, 11.4, -2.65, -0.38],
  [1, CONTACT, 0, -0.38],
] as const;

type Keys = readonly (readonly number[])[];
const repeat = (u: number): number => u - Math.floor(u);
const smooth = (u: number): number => u * u * (3 - 2 * u);
function curve(keys: Keys, u: number, channel: number, firstSlope = 0, lastSlope = 0): number {
  const j = keys.findIndex(([t]) => t > u);
  if (j < 0) {
    return keys[keys.length - 1][channel];
  }
  if (j === 0) {
    return keys[0][channel];
  }
  const slope = (i: number): number => {
    if (i === 0) {
      return firstSlope;
    }
    if (i === keys.length - 1) {
      return lastSlope;
    }
    const a = (keys[i][channel] - keys[i - 1][channel]) / (keys[i][0] - keys[i - 1][0]);
    const b = (keys[i + 1][channel] - keys[i][channel]) / (keys[i + 1][0] - keys[i][0]);
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  };
  const a = keys[j - 1];
  const b = keys[j];
  const width = b[0] - a[0];
  const q = (u - a[0]) / width;
  return lerp(a[channel], b[channel], smooth(q)) + width * q * (1 - q) * ((1 - q) * slope(j - 1) - q * slope(j));
}

function foot(phase: number, lateral: number) {
  const u = repeat(phase);
  if (u >= RELEASE) {
    return {
      x: lateral + curve(swing, u, 1, -STRIDE, -STRIDE),
      y: curve(swing, u, 2),
      tilt: curve(swing, u, 3),
      planted: false,
    };
  }
  const down = smooth(clamp(u / 0.075));
  const roll = smooth(clamp((u - 0.205) / (RELEASE - 0.205)));
  const tilt = -0.38 * (1 - down) + 0.76 * roll;
  const [, toeY] = toePoint([0, 0], tilt);
  return { x: lateral + CONTACT - STRIDE * u, y: -Math.max(0, toeY - 0.4), tilt, planted: true };
}

export const referenceRun: Motion = {
  duration: CYCLE,
  cycles: true,
  scroll: STRIDE / 4,
  sample(time) {
    const phase = repeat(time / CYCLE);
    const step = phase % 0.5;
    const near = foot(phase, 1.1);
    const far = foot(phase + 0.5, -1.1);
    const flight = clamp((step - RELEASE) / (0.5 - RELEASE));
    const lift = 4.5 * 4 * flight * (1 - flight);
    const hipX = -0.6 + 0.55 * Math.sin(phase * TAU);
    const hipY = curve(pelvis, step, 1, 30, 30);
    const drive = Math.cos((phase - 0.035) * TAU);
    const neckX = hipX + curve(lean, step, 1);
    const neckY = hipY - 8.7;
    const beat =
      step >= RELEASE
        ? "Split / flight"
        : step < 0.045
          ? "Contact"
          : step < 0.13
            ? "Load"
            : step < 0.245
              ? "Passing"
              : "Push-off";
    return {
      pose: pose({
        hx: hipX,
        hy: hipY,
        nx: neckX,
        ny: neckY,
        cb: 0.52 + 0.67 * Math.cos((phase - 0.085) * TAU),
        ffx: near.x,
        ffy: near.y,
        fa: near.tilt,
        bfx: far.x,
        bfy: far.y,
        ba: far.tilt,
        fx: neckX - 0.8 - 7.4 * drive,
        fy: neckY + 4.9 + 1.25 * drive,
        bx: neckX - 0.1 + 7.9 * drive,
        by: neckY + 4.65 - 1.6 * drive,
        sa: 2.94 + 0.27 * Math.cos((phase - 0.13) * TAU),
      }),
      root: (time / CYCLE) * STRIDE,
      lift,
      contacts: [near.planted, far.planted],
      beat,
    };
  },
};
