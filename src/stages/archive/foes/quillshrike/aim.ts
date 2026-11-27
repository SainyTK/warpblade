import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";

export function createDiveMark(e: Enemy, life: number): Effect {
  let age = 0;
  return {
    update(dt) {
      age += dt;
      return age < life && e.hp > 0 && (e.state === "wind" || e.state === "dive");
    },
    drawBack() {
      place();
      const k = clamp(age / life);
      const x = e.ax;
      const r = 13 - k * 5;
      const blink = k > 0.7 && Math.floor(age * 18) % 2 === 0 ? 0.5 : 1;
      ellipseRing(x, GROUND, r, r * 0.25, FOE.letter, (0.35 + 0.5 * k) * blink);
      ellipseRing(x, GROUND, r * 0.45, r * 0.12, FOE.letterHot, k * blink);
      hairline(x - 2, GROUND, x + 2, GROUND, FOE.letterHot, k);
      glow(x, GROUND - 1, 10, FOE.letter, 0.1 + 0.2 * k);
    },
    draw() {
      if (e.state !== "wind") return;
      place();
      const k = clamp(age / life);
      const steps = 6;
      for (let i = 1; i < steps; i++) {
        const u = i / steps;
        if ((i + Math.floor(age * 12)) % 2) continue;
        fleck(e.x + (e.ax - e.x) * u, e.y + (GROUND - e.y) * u, FOE.letter, 0.25 + 0.45 * k);
      }
    },
  };
}
