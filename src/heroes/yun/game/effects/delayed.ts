import type { Effect } from "../../../../types/effect";

/** something that happens `delay` seconds from now: a second crescent, a second rain */
export function createDelayed(delay: number, act: () => void): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < delay) return true;
      act();
      return false;
    },
    draw() {},
  };
}
