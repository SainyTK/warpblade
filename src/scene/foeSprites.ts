import { STEP } from "../constants/stage";
import { kindOf } from "../game/enemies/kinds";
import { game } from "../game/state";
import type { Enemy } from "../types/enemy";
import type { SpriteBox, SpriteImage } from "../types/sprite";

/**
 * Foes are redrawn from their parts, which is most of a busy frame's cost. Each foe keeps its last drawn picture and
 * shows it for HOLD seconds of game time, so its pose changes about 30 times a second however fast the screen is,
 * while its place on the stage still moves every frame. A change of state, or being stunned, thrown in the air or frozen, redraws at once, so no wind-up or stagger shows late.
 */
const HOLD = 1 / 36;
/** new foes start their holds a step apart, so a crowd's redraws spread over the frames */
const PHASES = 4;

interface Held {
  image: SpriteImage & { box: SpriteBox };
  at: number;
  /** what the pose depends on in steps: a change here redraws at once */
  pose: string;
}
const held = new WeakMap<Enemy, Held>();
let made = 0;

/** copy the drawn box of a kind's shared canvas into the foe's own picture, clearing what the last pose left */
function keep(to: Held["image"], from: SpriteImage): void {
  const old = to.box;
  for (let y = old.y0; y <= old.y1; y++) to.d.fill(0, y * to.w + old.x0, y * to.w + old.x1 + 1);
  const box = from.box ?? { x0: 0, y0: 0, x1: from.w - 1, y1: from.h - 1 };
  for (let y = box.y0; y <= box.y1; y++) {
    const row = y * from.w;
    to.d.set(from.d.subarray(row + box.x0, row + box.x1 + 1), row + box.x0);
  }
  to.box = { ...box };
}

const poseOf = (e: Enemy): string => `${e.state}:${e.stun > 0}:${Boolean(e.air)}:${e.frozen > 0}:${e.stagger > 0}`;

/** the foe's picture to show this frame */
export function foeSprite(e: Enemy): SpriteImage {
  const t = game.t;
  let h = held.get(e);
  const pose = poseOf(e);
  if (h && h.pose === pose && t >= h.at && t - h.at < HOLD) return h.image;
  const drawn = kindOf(e.type).draw(e, t);
  if (!h) {
    const empty = { x0: 0, y0: 0, x1: -1, y1: -1 };
    h = {
      image: { ...drawn, d: new Uint32Array(drawn.d.length), box: empty },
      at: t - (made++ % PHASES) * STEP,
      pose,
    };
    held.set(e, h);
  } else h.at = t;
  h.pose = pose;
  keep(h.image, drawn);
  return h.image;
}
