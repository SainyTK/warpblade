import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, place } from "../../../../engine/frame";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { SLAM, windTime } from "./pose";

const F = GRAVE.fire;

function slamMark(e: Enemy, u: number): void {
  const x = e.x + e.face * 30;
  ellipseRing(x, GROUND, 10 - u * 3, 2, u > 0.7 ? F[3] : F[1], 0.35 + u * 0.55);
  ellipseRing(x, GROUND, 5, 1.2, F[2], u);
  for (let d = 6; d < 90; d += 6) {
    const k = clamp(u * 1.6 - d / 90);
    fleck(x + e.face * (8 + d), GROUND - 1, F[2], k * 0.8);
  }
  glow(x, GROUND - 2, 10 + u * 10, F[2], 0.12 + u * 0.3);
}

function chargeLine(e: Enemy, u: number): void {
  const from = e.x + e.face * 10;
  const run = (e.ax - from) * e.face;
  for (let d = 0; d < run; d += 5) {
    const x = from + e.face * d;
    const hot = d < run * u;
    hairline(x, GROUND + 0.5, x + e.face * 3, GROUND + 0.5, hot ? F[2] : F[0], hot ? 0.85 : 0.45);
  }
  glow(e.ax, GROUND - 2, 6 + u * 8, F[2], 0.1 + u * 0.3);
}

export function createLordTell(e: Enemy): Effect {
  const move = e.n;
  return {
    update: () => e.hp > 0 && e.state === "wind" && e.n === move && game.enemies.includes(e),
    draw() {},
    drawBack() {
      place();
      const u = clamp(e.st / windTime(e));
      if (move === SLAM) slamMark(e, u);
      else chargeLine(e, u);
    },
  };
}
