import { DIAL } from "../../../constants/mirel/look";
import { disc, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { type Dial, drawDial, drawHand, drawHub } from "./clockArt";
import { drawStoppedRim } from "./stoppedLook";

/** the clock face over a stopped foe: its width, and how often its hand ticks */
const FACE = 10;
const TICK = 0.25;
/** seconds the face is white as it opens */
const OPEN_FLASH = 2 / 30;

/** a clock face over a foe she stopped in time, its hand ticking every quarter second, until the foe restarts */
export function createClockFace(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.hp > 0 && e.stopped > 0;
    },
    draw() {
      place();
      const b = enemyBox(e);
      const [cx] = enemyCenter(e);
      const cy = b[1] - FACE - 2;
      drawStoppedRim(e);
      const dial: Dial = { x: cx, y: cy, r: FACE, a: 1, floor: Number.POSITIVE_INFINITY, flash: t < OPEN_FLASH };
      disc(cx, cy, FACE, DIAL.fill, 0.3);
      drawDial(dial);
      drawHand(dial, Math.floor(t / TICK) / 12, FACE - 3, false);
      drawHub(dial);
    },
  };
}
