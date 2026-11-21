import { pose } from "../../../../constants/hero";
import { fitRunFeet } from "../../../../drill";
import type { DrillPoses } from "../../../../types/drill";
import { clamp, smooth, TAU } from "../../../../utils/math";
import { EN_GARDE } from "../../constants/clips/base";

const RUN_TOE_OFF = 0.46;

function fencerUpperBody(phase: number) {
  const step = ((((phase * 2) % 1) + 1) % 1) / 2;
  const load = Math.sin(Math.PI * clamp(step / RUN_TOE_OFF)) ** 1.2;
  const flight = clamp((step - RUN_TOE_OFF) / (0.5 - RUN_TOE_OFF));
  const lift = 0.7 * 4 * flight * (1 - flight);
  const push = smooth(0.17, RUN_TOE_OFF, step) * (1 - smooth(RUN_TOE_OFF, 0.5, step));
  const hipX = -0.4 + 0.3 * Math.sin(phase * TAU);
  const hipY = -10.6 + 0.8 * load - 0.5 * push - lift;
  const neckX = hipX + 3.6 + 0.8 * load;
  const neckY = hipY - 9.6;
  const sway = Math.sin(phase * TAU);
  return pose({
    hx: hipX,
    hy: hipY,
    nx: neckX,
    ny: neckY,
    cb: 0.35 + 0.25 * Math.cos(phase * TAU),
    fx: neckX + 6.2 + 0.6 * sway,
    fy: neckY + 5.4 - 0.5 * load,
    sa: 0.05 + 0.06 * sway,
    bx: hipX - 3.4,
    by: hipY - 1.6,
    be: 1,
  });
}

const STANCE = EN_GARDE;
const BREATHE = { ...EN_GARDE, hy: -13.6, ny: -23.7, by: -21.6, fy: -18.4, sa: -0.14 };

const BRAKE = pose({
  hx: -3.5,
  hy: -11,
  nx: -2,
  ny: -21,
  cb: 0.2,
  fx: 7,
  fy: -19,
  sa: -0.45,
  bx: -9,
  by: -20,
  ffx: 10,
  fa: -0.2,
  bfx: -6,
  ba: 0.3,
});
const LOW = pose({
  hx: -1,
  hy: -9,
  nx: 2,
  ny: -18.5,
  cb: 0.5,
  fx: 9,
  fy: -13,
  sa: 0.2,
  bx: -8,
  by: -18,
  ffx: 8,
  bfx: -7,
  ba: 0.4,
});
const TOUCHDOWN = { ...LOW, hy: -11.5, ny: -21.5, nx: 1, fy: -16, by: -21, sa: 0 };

const DASH = pose({
  hx: -2,
  hy: -9,
  nx: 5,
  ny: -17,
  cb: 0.6,
  fx: 16,
  fy: -15,
  sa: 0.02,
  bx: -9,
  by: -19,
  be: 1,
  ffx: 9,
  ffy: 0,
  fa: -0.1,
  bfx: -15,
  bfy: -1,
  ba: 1,
});
const AIR_DASH = { ...DASH, hy: -12, ny: -19, fy: -17, ffx: 4, ffy: -6, fa: 0.5, bfx: -14, bfy: -6, ba: 1.1 };

const RISE = pose({
  hx: 0,
  hy: -14,
  nx: 1.5,
  ny: -24.5,
  cb: 0.3,
  fx: 7,
  fy: -26,
  sa: -1.05,
  bx: -6,
  by: -18,
  be: 1,
  ffx: 5,
  ffy: -9,
  fa: 0.4,
  bfx: -3,
  bfy: -1,
  ba: 0.9,
});
const LEAP = pose({
  hx: -2,
  hy: -12,
  nx: 5,
  ny: -20,
  cb: 0.6,
  fx: 15,
  fy: -18,
  sa: -0.08,
  bx: -9,
  by: -21,
  be: 1,
  ffx: 7,
  ffy: -7,
  fa: 0.3,
  bfx: -13,
  bfy: -3,
  ba: 1.1,
});
const FALL = pose({
  hx: -0.5,
  hy: -14,
  nx: 0.5,
  ny: -24,
  cb: 0.2,
  fx: 9,
  fy: -17,
  sa: 0.55,
  bx: -8,
  by: -24,
  ffx: 5,
  ffy: -2,
  fa: 0.25,
  bfx: -5,
  bfy: -5,
  ba: 0.7,
});
const WALL = pose({
  hx: -3,
  hy: -12.5,
  nx: -2,
  ny: -22.5,
  cb: 0.1,
  fx: 6,
  fy: -19,
  sa: -0.3,
  bx: -7,
  by: -25,
  ffx: 5,
  ffy: -8,
  fa: -0.4,
  bfx: 1,
  bfy: -1,
  ba: 0.2,
});
const KICK = pose({
  hx: -1,
  hy: -13,
  nx: 4,
  ny: -22,
  cb: 0.5,
  fx: 14,
  fy: -20,
  sa: -0.25,
  bx: -9,
  by: -23,
  be: 1,
  ffx: 6,
  ffy: -9,
  fa: 0.6,
  bfx: -12,
  bfy: -9,
  ba: 1.2,
});

const GUARD = pose({
  hx: -1.5,
  hy: -12.8,
  nx: -0.5,
  ny: -22.8,
  cb: 0.2,
  fx: 6.5,
  fy: -20.5,
  sa: -1.2,
  bx: -6.5,
  by: -22.5,
  ffx: 6,
  bfx: -5.5,
  ba: 0.3,
});
const AIR_GUARD = { ...GUARD, ffy: -6, bfy: -4, fa: 0.3, ba: 0.6 };
const STAGGER = pose({
  hx: -4,
  hy: -12,
  nx: -6.5,
  ny: -21.5,
  cb: -0.4,
  fx: 4,
  fy: -15,
  sa: 0.9,
  bx: -10,
  by: -20,
  ffx: 6,
  bfx: -7,
  ba: 0.3,
});
const PARRY_CONTACT = pose({
  hx: -1,
  hy: -12.5,
  nx: 0.5,
  ny: -22.5,
  cb: 0.3,
  fx: 9,
  fy: -21,
  sa: -0.7,
  bx: -7,
  by: -23,
  ffx: 7,
  bfx: -5.5,
  ba: 0.3,
});
const PARRY_RETURN = pose({
  hx: 2,
  hy: -11.5,
  nx: 5,
  ny: -21,
  cb: 0.5,
  fx: 18,
  fy: -18,
  sa: -0.02,
  bx: -8,
  by: -22,
  ffx: 11,
  bfx: -6,
  ba: 0.3,
});
const SPELL = pose({
  hx: -1,
  hy: -13,
  nx: 1,
  ny: -23,
  cb: 0.4,
  fx: 2,
  fy: -22,
  sa: -1.5,
  bx: 13,
  by: -20,
  be: 0,
  ffx: 7,
  bfx: -6,
  ba: 0.3,
});
const SKILL = pose({
  hx: 3,
  hy: -10,
  nx: 8,
  ny: -18.5,
  cb: 0.6,
  fx: 20,
  fy: -16,
  sa: 0,
  bx: -9,
  by: -21,
  be: 1,
  ffx: 13,
  fa: -0.1,
  bfx: -9,
  ba: 0.5,
});

export const CERISE_POSES: Partial<DrillPoses> = {
  stance: STANCE,
  breathe: BREATHE,
  run: fitRunFeet(fencerUpperBody),
  brake: BRAKE,
  low: LOW,
  touchdown: TOUCHDOWN,
  dash: DASH,
  airDash: AIR_DASH,
  rise: RISE,
  leap: LEAP,
  fall: FALL,
  wall: WALL,
  kick: KICK,
  guard: GUARD,
  airGuard: AIR_GUARD,
  stagger: STAGGER,
  parryContact: PARRY_CONTACT,
  parryReturn: PARRY_RETURN,
  spell: SPELL,
  skillCut: SKILL,
};
