import { clamp } from "./math";

const REST = 1.8;
const WARNING = 0.62;
const HOLD = 0.76;
const STROKE = 0.1;
const PERIOD = REST + WARNING + HOLD + STROKE * 2;
export const SPIKE_HEIGHT = 11;

export function spikeCycle(time: number, x: number): { warning: number; height: number } {
  const phase = (time + x * 0.031) % PERIOD;
  const movement = phase - REST - WARNING;
  const height = SPIKE_HEIGHT * clamp(Math.min(movement, HOLD + 2 * STROKE - movement) / STROKE);
  return {
    warning: movement < 0 ? clamp((phase - REST) / WARNING) : 0,
    height: height < 1 ? 0 : height,
  };
}
