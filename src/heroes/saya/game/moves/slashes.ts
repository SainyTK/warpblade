import type { SlashShape } from "../../../../types/effect";

/** Saya's slash shapes, in local pixels facing right; her ramp draws them as ink with a white rim */
export const SLASHES = {
  /** the draw cut: a long, nearly level stroke from behind her hip out ahead */
  draw: { cx: 4, cy: -18, R: 27, sy: 0.3, rot: -0.04, a0: -2.95, a1: 0.35, W: 7, sweep: 0.04, hold: 0.06, trail: 0.26 },
  /** the return cut: a rising stroke from low behind up across her front */
  rise: { cx: 5, cy: -20, R: 23, sy: 0.72, rot: 0.3, a0: 1.7, a1: -1.55, W: 8, hold: 0.05, trail: 0.24 },
  /** the falling draw: a stroke down and ahead */
  fall: { cx: 6, cy: -17, R: 22, sy: 0.82, rot: 0.2, a0: -2.1, a1: 1.15, W: 8, hold: 0.05, trail: 0.24 },
  /** the counter draw: the draw cut's stroke, fuller */
  counter: {
    cx: 4,
    cy: -20,
    R: 30,
    sy: 0.36,
    rot: -0.06,
    a0: -3.0,
    a1: 0.45,
    W: 10,
    sweep: 0.03,
    hold: 0.08,
    trail: 0.3,
  },
  /** the warp's cut, left behind her as she lands past the foe */
  pass: { cx: -8, cy: -16, R: 28, sy: 0.22, rot: 0, a0: -3.05, a1: 0.1, W: 7, sweep: 0.03, hold: 0.06, trail: 0.3 },
  /** Moonrise's rising draw, up over her head */
  moonrise: { cx: 4, cy: -22, R: 22, sy: 0.9, rot: 0.2, a0: 1.9, a1: -1.6, W: 9, hold: 0.06, trail: 0.28 },
} as const satisfies Record<string, SlashShape>;

/** the angle of the ink line each blow leaves stored in a foe */
export const STORE_ANGLE = {
  drawCut: -0.12,
  returnCut: -0.95,
  airDraw: 0.85,
  line: 0.02,
  rise: -1.3,
  warp: 0.1,
} as const;
