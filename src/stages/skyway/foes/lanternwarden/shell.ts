import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { wardLeft } from "../stormWard";
import { WARDEN } from "./colors";

export function createWardShell(e: Enemy): Effect {
  return {
    update() {
      return e.hp > 0 && wardLeft(e) > 0;
    },
    draw() {
      const left = wardLeft(e);
      if (left < 0.8 && Math.floor(game.t * 12) % 2 === 0) return;
      place();
      const [cx, cy] = enemyCenter(e);
      const [x0, y0, x1, y1] = enemyBox(e);
      const rx = (x1 - x0) / 2 + 4;
      const ry = (y1 - y0) / 2 + 4;
      ellipseRing(cx, cy, rx, ry, WARDEN.light[3], 0.55);
      ellipseRing(cx, cy, rx - 1, ry - 1, WARDEN.light[2], 0.3);
      for (let k = 0; k < 6; k++) {
        const a = game.t * 1.6 + (k / 6) * TAU;
        fleck(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, k % 2 ? WARDEN.light[4] : WARDEN.light[3], 0.9);
      }
      glow(cx, cy, Math.max(rx, ry) + 4, WARDEN.light[2], 0.12);
    },
  };
}
