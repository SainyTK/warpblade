import { hero } from "../../../game/state";
import { clamp } from "../../../utils/math";
import { bladeAngle } from "../../../utils/poseFrame";
import { TASSEL } from "../constants/tassel";
import { yun } from "./state";

/**
 * The tassel swings from the pommel like a weight on a cord: it trails behind as the pommel moves, swings back as it
 * stops and settles, read by the jian's drawing through the pose's `bs`. Positive swings toward Yun's back.
 */
export function swingTassel(dt: number): void {
  if (dt <= 0) return;
  const [hx] = hero.hand;
  const x = hero.x + hero.face * (hx - Math.cos(bladeAngle(hero.pose)) * TASSEL.pommel);
  if (Number.isNaN(yun.pommelX)) yun.pommelX = x;
  const vx = (x - yun.pommelX) / dt;
  const ax = (vx - yun.pommelVx) / dt;
  yun.pommelX = x;
  yun.pommelVx = vx;
  const local = hero.face * clamp(vx, -TASSEL.fastest, TASSEL.fastest);
  const push = hero.face * clamp(ax, -TASSEL.hardest, TASSEL.hardest);
  const target = clamp(local * TASSEL.trail, -TASSEL.most, TASSEL.most);
  const force = (target - yun.tassel) * TASSEL.spring - yun.tasselSpeed * TASSEL.damp + push * TASSEL.kick;
  yun.tasselSpeed += force * dt;
  yun.tassel = clamp(yun.tassel + yun.tasselSpeed * dt, -TASSEL.most, TASSEL.most);
}

/** a warp or a fresh run: the tassel hangs still from wherever the pommel is now */
export function settleTassel(): void {
  yun.pommelX = Number.NaN;
  yun.pommelVx = 0;
  yun.tassel = 0;
  yun.tasselSpeed = 0;
}
