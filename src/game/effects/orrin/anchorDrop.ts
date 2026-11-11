import { ANCHOR_SHAPE, TEAR_LOOK } from "../../../constants/orrin/chainLook";
import { PAL } from "../../../constants/palette";
import { GROUND } from "../../../constants/stage";
import { glow, place } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { game, progress } from "../../state";
import { dust, shake } from "../../world";
import { drawAnchor } from "./anchor";
import { drawLinks } from "./chainLinks";
import { drawTear } from "./tearLens";

/** what one anchor does where it lands */
export interface AnchorSpec {
  power: number;
  ring: number;
  stun: number;
  pull: number;
  /** seconds before it starts to fall, so a row of anchors lands one after another */
  delay: number;
}

const TOP = 18;
const FALL = 0.32;

/** a rift tear in the sky, an iron anchor dropped from it onto the floor, the ring where it lands */
export function createAnchorDrop(x: number, floor: number, spec: AnchorSpec, landed: (x: number) => void): Effect {
  let t = -spec.delay;
  let down = false;
  return {
    update(dt) {
      t += dt;
      if (t >= 0 && !down && spec.pull)
        for (const e of game.enemies) {
          const [cx] = enemyCenter(e);
          if (e.hp > 0 && Math.abs(cx - x) < spec.ring + spec.pull)
            e.x += Math.sign(x - cx) * Math.min(spec.pull, Math.abs(x - cx)) * dt * 3;
        }
      if (!down && t >= FALL) {
        down = true;
        for (const e of game.enemies) {
          if (e.hp <= 0) continue;
          const [cx, cy] = enemyCenter(e);
          if (Math.abs(cx - x) > spec.ring || cy < floor - spec.ring - 20) continue;
          dealDamage(e, progress.stats.ap * spec.power, {
            fromX: x,
            kx: Math.sign(cx - x) * 70,
            stun: spec.stun,
            heavy: true,
            source: "o_anchorfall",
          });
        }
        game.fx.push(createFloorRing(x, floor, spec.ring, PAL.brass, 0.35));
        dust(x, floor, 8);
        shake(0.15, 2.5);
        sfx.boom();
        landed(x);
      }
      return t < FALL + 0.5;
    },
    draw() {
      if (t < -0.15) return;
      place();
      const open = Math.min(1, (t + 0.15) / 0.15) * (t > FALL + 0.2 ? Math.max(0, 1 - (t - FALL - 0.2) / 0.3) : 1);
      drawTear(x, TOP, TEAR_LOOK.anchor, open, game.t, true);
      const k = Math.min(1, Math.max(0, t / FALL));
      const y = TOP + (floor - 2 - TOP) * k * k;
      if (t < 0) return;
      drawLinks(x, TOP, x, y - ANCHOR_SHAPE.tall, undefined, 0.8);
      drawAnchor(x, y);
      if (y > GROUND - 40) glow(x, y, 10, PAL.brass[3], 0.3);
    },
  };
}
