import type { Effect } from "../../../../types/effect";

/** an effect that waits `delay` seconds, then lets `go` loose once */
export function later(delay: number, go: () => void): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < delay) return true;
      go();
      return false;
    },
    draw() {},
  };
}
