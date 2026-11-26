import { clamp } from "../../../utils/math";

const REST = 2.1;
const WARNING = 0.9;
const RISE = 0.08;
const HOLD = 0.55;
const FALL = 0.16;
const PERIOD = REST + WARNING + RISE + HOLD + FALL;
const STAGGER = 0.037;

export const JET_HEIGHT = 56;

export interface VentState {
  warning: number;
  height: number;
  eruption: number;
}

export function ventCycle(time: number, x: number): VentState {
  const clock = time + x * STAGGER;
  const phase = clock % PERIOD;
  const eruption = Math.floor(clock / PERIOD);
  const burst = phase - REST - WARNING;
  if (burst < 0) return { warning: clamp((phase - REST) / WARNING), height: 0, eruption };
  const rise = clamp(burst / RISE);
  const fall = clamp((RISE + HOLD + FALL - burst) / FALL);
  return { warning: 0, height: JET_HEIGHT * Math.min(rise, fall), eruption };
}
