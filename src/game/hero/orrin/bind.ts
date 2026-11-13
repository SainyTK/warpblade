import { CHAIN_BIND } from "../../../constants/orrin/guard";
import { PAL } from "../../../constants/palette";
import { W } from "../../../constants/stage";
import type { Enemy } from "../../../types/enemy";
import type { Point } from "../../../types/world";
import { clamp } from "../../../utils/math";
import { drawLinks } from "../../effects/orrin/chainLinks";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { orrin, orrinHost } from "./memory";
import { rustFoe } from "./rust";

/**
 * The chain wraps a foe. A minion is stunned for `time`, and hauled to stand at `toX` when one is given; a mini boss
 * or boss is held in place, or with `haulBig` stunned and hauled as a minion is. Rust Bite rusts it.
 */
export function bindFoe(e: Enemy, time: number, toX: number | null, haulBig = false): void {
  if (e.hp <= 0) return;
  const hauled = e.rank === "minion" || haulBig;
  if (hauled) e.stun = Math.max(e.stun, time);
  else e.pinned = Math.max(e.pinned, time);
  rustFoe(e);
  const to = hauled && toX !== null ? clamp(toX, 8, W - 8) : null;
  orrinHost.bound = [...orrinHost.bound.filter((b) => b.foe !== e), { foe: e, toX: to }];
  orrin.bindLeft = Math.max(orrin.bindLeft, time);
  orrin.bindT = 0;
}

/** the yank hauls each bound foe the rest of the way to its place by the end of the yank's time */
function haul(dt: number): void {
  const left = CHAIN_BIND.yankTime - orrin.bindT;
  if (left <= 0) return;
  const share = Math.min(1, dt / left);
  for (const b of orrinHost.bound) {
    if (b.toX === null) continue;
    b.foe.x += (b.toX - b.foe.x) * share;
    b.foe.vx = 0;
  }
}

/** the yank runs, then the wrap holds until its time runs out; fallen foes drop out of it */
export function tickBind(dt: number): void {
  if (orrin.bindLeft <= 0) return;
  haul(dt);
  orrin.bindT += dt;
  orrin.bindLeft -= dt;
  const held = orrinHost.bound.filter((b) => b.foe.hp > 0);
  if (held.length !== orrinHost.bound.length) orrinHost.bound = held;
  if (orrin.bindLeft > 0 && held.length) return;
  orrin.bindLeft = 0;
  orrinHost.bound = [];
}

/** two turns of chain wound round a foe's body, the back of each turn dimmer than the front */
function coils(e: Enemy, a: number): void {
  const [x0, y0, x1, y1] = enemyBox(e);
  const h = y1 - y0;
  for (const at of [0.38, 0.66]) {
    const y = y0 + h * at;
    drawLinks(x0 - 1, y + 2, x1 + 1, y - 1, PAL.brass[3], a * 0.55);
    drawLinks(x0 - 1, y - 1, x1 + 1, y + 2, PAL.brass[4], a);
  }
}

/**
 * The bound foes, each wound in chain, flickering as the wrap is about to loosen; while a parry's yank hauls them the
 * chain also runs taut from his hand to the first of them.
 */
export function drawBind(hand: Point): void {
  if (orrin.bindLeft <= 0) return;
  const a = orrin.bindLeft < 0.3 ? 0.4 + 0.6 * (Math.floor(orrin.bindLeft * 20) % 2) : 1;
  for (const b of orrinHost.bound) if (b.foe.hp > 0) coils(b.foe, a);
  const first = orrinHost.bound[0];
  if (!first || first.toX === null || orrin.bindT >= CHAIN_BIND.yankTime) return;
  const [cx, cy] = enemyCenter(first.foe);
  drawLinks(hand.x, hand.y, cx, cy, PAL.brass[4]);
}
