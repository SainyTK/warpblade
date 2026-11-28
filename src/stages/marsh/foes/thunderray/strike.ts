import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, hairline, place, px } from "../../../../engine/frame";
import { BOLT_HALF, createStormBolt } from "../../../../game/enemies/rain/stormBolt";
import { game } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { RAY_COLORS as C } from "./colors";
import { RAY } from "./constants";

function mark(x: number, u: number, front: boolean): void {
  const r = BOLT_HALF + (1 - u) * 7;
  const hot = u > 0.75;
  ellipseRing(x, GROUND, r, r * 0.24, hot ? C.veinHot : C.vein, 0.5 + u * 0.5, front ? 1 : -1);
  if (!front) return;
  glow(x, GROUND - 2, BOLT_HALF * 2.2, C.vein, 0.15 + u * 0.3);
  hairline(x - BOLT_HALF * u, GROUND + 0.25, x + BOLT_HALF * u, GROUND + 0.25, C.veinHot, 0.9);
}

export function createChainStrike(x: number, delay: number, damage: number): Effect {
  let t = -delay;
  const warn = RAY.strikeWarn;
  return {
    update(dt) {
      t += dt;
      if (t < warn) return true;
      game.fx.push(createStormBolt(x, RAY.strikeTop, damage));
      sfx.thunder();
      return false;
    },
    drawBack() {
      if (t < 0) return;
      const u = clamp(t / warn);
      place();
      mark(x, u, false);
      for (let y = RAY.strikeTop; y < GROUND - 2; y += 5)
        if ((y + game.t * 40) % 10 < 5) px(x, y, C.vein, 0.15 + u * 0.35);
    },
    draw() {
      if (t < 0) return;
      place();
      mark(x, clamp(t / warn), true);
    },
  };
}
