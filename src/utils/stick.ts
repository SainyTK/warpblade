import { STICK } from "../constants/touch";
import type { StickInput } from "../types/touch";

export const STICK_IDLE: StickInput = { dir: 0, run: false, up: false, down: false };

/**
 * Read a stick push as directions. `x` and `y` are the knob's offset as parts of the reach (screen y points down),
 * `last` is the previous reading, so each threshold turns off a little below where it turned on.
 */
export function readStick(x: number, y: number, last: StickInput): StickInput {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const steep = ay >= ax * STICK.steep;
  const dir = ax >= STICK.deadzone ? Math.sign(x) : 0;
  const keepRun = last.run && dir === last.dir;
  const run = dir !== 0 && ax >= (keepRun ? STICK.run.off : STICK.run.on);
  const upOn = last.up ? STICK.vertical.off : STICK.vertical.on;
  const downOn = last.down ? STICK.vertical.off : STICK.vertical.on;
  return {
    dir,
    run,
    up: steep && y <= -upOn,
    down: steep && y >= downOn,
  };
}
