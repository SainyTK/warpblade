import { place } from "../../../../engine/frame";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { drawWardThread, drawWardWeb } from "./drawWeb";
import { raiseWard, warded } from "./store";

const LINK = { grow: 0.25, thread: 0.7, fade: 0.3 } as const;

export function createWardLink(caster: Enemy, target: Enemy, from: () => [number, number]): Effect {
  let t = 0;
  let fade = LINK.fade;
  raiseWard(target);
  return {
    update(dt) {
      t += dt;
      if (!warded(target) || !game.enemies.includes(target)) fade -= dt;
      return fade > 0;
    },
    draw() {
      const [x0, y0, x1, y1] = enemyBox(target);
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const k = clamp(t / LINK.grow) * clamp(fade / LINK.fade);
      place();
      drawWardWeb(cx, cy, (x1 - x0) / 2 + 3, (y1 - y0) / 2 + 3, game.t + target.seed, k);
      if (t < LINK.thread && target !== caster && caster.hp > 0) {
        const [sx, sy] = from();
        drawWardThread(sx, sy, cx, cy, game.t, clamp((LINK.thread - t) / 0.3) * k);
      }
    },
  };
}
