import { isFree } from "../../../../../game/hero/actions";
import { runDash, tryDash } from "../../../../../game/hero/dash";
import { readPlatformDrop } from "../../../../../game/hero/traversal";
import { take } from "../../../../../game/input";
import { withCharms } from "../../../../../game/skills/query";
import { hero } from "../../../../../game/state";
import { MOTION } from "../../../../../kaelDrill/constants";
import { readJump } from "./jump";
import { motion } from "./state";

export { resetMotion } from "./state";
export { fall, land, steer } from "./travel";

export function readMotion(dir: number, dt: number, warpPress: boolean): void {
  motion.grace = hero.ground ? MOTION.jumpGrace : Math.max(0, motion.grace - dt);
  motion.wallLock = Math.max(0, motion.wallLock - dt);
  motion.jumpBuffer = Math.max(0, motion.jumpBuffer - dt);
  motion.dashBuffer = Math.max(0, motion.dashBuffer - dt);
  motion.dashReadyIn = Math.max(0, motion.dashReadyIn - dt);
  if (!warpPress && take("dash") && motion.dashReadyIn === 0) motion.dashBuffer = MOTION.buffer;
  if (motion.dashBuffer && !motion.wallLock && tryDash(dir, true)) {
    motion.dashBuffer = 0;
    motion.dashReadyIn = MOTION.dashTime + withCharms("cooldown", MOTION.dashRecovery);
    motion.jumpBoost = false;
    motion.variableRise = false;
  }
  const grounded = hero.ground;
  readPlatformDrop();
  if (grounded && !hero.ground) motion.grace = 0;
  readJump(dir, isFree());
}

export function runDrillDash(dt: number): void {
  const phase = 1 - hero.st / MOTION.dashTime;
  hero.vx = hero.face * (MOTION.dash + MOTION.dashBurst * (2 * phase - 1));
  runDash(dt, MOTION.dashTime);
}
