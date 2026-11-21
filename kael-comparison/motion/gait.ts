import { pose } from "../../src/constants/hero";
import { STRIDE } from "../../src/constants/motion";
import { toePoint } from "../../src/rig";
import { clamp, lerp } from "../../src/utils/math";
import type { Motion, Sample } from "./types";

const turn = Math.PI * 2;
const cycle = (u: number): number => u - Math.floor(u);
const ease = (u: number): number => u * u * (3 - 2 * u);

function foot(phase: number, stride: number, stance: number, depth: number, running: boolean) {
  const u = cycle(phase);
  const reach = (stride * stance) / 2;
  if (u < stance) {
    const support = u / stance;
    const tilt = -0.22 * (1 - ease(clamp(support / 0.23))) + 0.55 * ease(clamp((support - 0.73) / 0.27));
    const [, toeY] = toePoint([0, 0], tilt);
    return { x: depth + reach - stride * u, y: -Math.max(0, toeY - 0.4), tilt, planted: true };
  }
  const swing = (u - stance) / (1 - stance);
  const curve = Math.sin(Math.PI * swing);
  const drift = -stride * (1 - stance) * swing * (1 - swing) * (1 - 2 * swing);
  return {
    x: depth + lerp(-reach, reach, ease(swing)) + drift,
    y: -curve * (running ? 7 : 4.2) - lerp(1.25, 0, swing),
    tilt: lerp(0.55, -0.22, ease(swing)) + 0.5 * curve,
    planted: false,
  };
}

export function gait(running: boolean): Motion {
  const stride = running ? STRIDE.run : STRIDE.walk;
  const speed = running ? 105 : 38;
  const duration = stride / speed;
  const stance = running ? 0.37 : 0.61;
  return {
    duration,
    cycles: true,
    scroll: stride / 4,
    sample(time): Sample {
      const phase = cycle(time / duration);
      const near = foot(phase, stride, stance, 1.1, running);
      const far = foot(phase + 0.5, stride, stance, -1.1, running);
      const twice = cycle(phase * 2);
      const bend = Math.cos((twice - 0.2) * turn);
      const swing = Math.cos((phase - 0.035) * turn);
      const delayed = Math.cos((phase - 0.075) * turn);
      const hipX = 0.64 * Math.sin(phase * turn);
      const hipY = running ? -11.3 + 1.25 * bend : -12.4 + 0.55 * bend;
      const lean = running ? 4.5 : 1.5;
      const neckX = hipX + lean - 0.5 * delayed;
      const neckY = hipY - 9.7 - 0.4 * Math.cos((twice - 0.29) * turn);
      const passing = twice > 0.26 && twice < 0.52;
      const beat =
        !near.planted && !far.planted ? "Flight" : passing ? "Passing" : twice < 0.26 ? "Contact / load" : "Push-off";
      return {
        pose: pose({
          hx: hipX,
          hy: hipY,
          nx: neckX,
          ny: neckY,
          cb: (running ? 0.6 : 0.3) * delayed,
          ffx: near.x,
          ffy: near.y,
          fa: near.tilt,
          bfx: far.x,
          bfy: far.y,
          ba: far.tilt,
          fx: neckX - (running ? 1.8 : 0.2) - (running ? 3.5 : 2.5) * swing,
          fy: neckY + 6.3 - 1.1 * Math.abs(swing),
          bx: neckX - 0.6 + (running ? 5.8 : 3.6) * swing,
          by: neckY + 6.8 - 1.2 * Math.abs(swing),
          sa: (running ? 2.62 : 1.28) + 0.26 * delayed,
        }),
        root: time * speed,
        lift: 0,
        contacts: [near.planted, far.planted],
        beat,
      };
    },
  };
}
