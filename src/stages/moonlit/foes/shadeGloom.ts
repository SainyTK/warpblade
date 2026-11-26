import { glow, haze, place } from "../../../engine/frame";
import { game } from "../../../game/state";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { SHADE_COLORS as C } from "./shadeColors";
import { flareOf, lanternAt } from "./shadePose";

const GLOOM = { radius: 40, depth: 0.5 } as const;

export function createShadeGloom(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && game.enemies.includes(e),
    drawBack() {
      place();
      const flare = flareOf(e);
      haze(e.x, e.y + 4, GLOOM.radius, GLOOM.radius * 0.85, C.gloom, GLOOM.depth * (1 - flare * 0.6));
    },
    draw() {
      place();
      const flare = flareOf(e);
      const [lx, ly] = lanternAt(e, game.t);
      const flicker = 0.85 + 0.15 * Math.sin(game.t * 11 + e.seed);
      glow(lx, ly, 10 + flare * 22, C.flame, (0.28 + flare * 0.45) * flicker);
    },
  };
}
