import { inFreeState } from "../../../../../game/hero/actions";
import { clampHeroX, wallSide } from "../../../../../game/hero/terrain";
import { isHeld } from "../../../../../game/input";
import { hero, progress } from "../../../../../game/state";
import { MOTION } from "../../../../../kaelDrill/constants";
import { approach } from "../../../../../utils/math";
import { motion } from "./state";

export function wallContact(): number {
  if (hero.x === clampHeroX(-Infinity)) return -1;
  if (hero.x === clampHeroX(Infinity)) return 1;
  return wallSide(hero.x, hero.y);
}

export function steer(dir: number, dt: number): void {
  hero.running = dir !== 0;
  if (motion.wallLock > 0) return;
  if (dir) hero.face = dir;
  if (motion.jumpBoost && (!dir || dir === Math.sign(hero.vx))) return;
  motion.jumpBoost = false;
  const accel = hero.ground ? MOTION.groundAccel : MOTION.airAccel;
  const brake = hero.ground ? MOTION.groundBrake : MOTION.airBrake;
  hero.vx = approach(hero.vx, dir * MOTION.run * progress.stats.move, (dir ? accel : brake) * dt);
}

export function fall(dir: number, dt: number, hang: boolean): void {
  if (hero.state === "dash" || hero.ground) {
    hero.vy = 0;
    return;
  }
  if (motion.variableRise && !isHeld("up") && hero.vy < -MOTION.release) {
    hero.vy = -MOTION.release;
    motion.variableRise = false;
  }
  const rising = hero.vy < 0;
  const gravity = rising ? MOTION.riseGravity : MOTION.fallGravity;
  const sliding = !rising && motion.wallLock === 0 && dir !== 0 && dir === wallContact() && inFreeState();
  const limit = hang ? 60 : sliding ? MOTION.wallSlide : MOTION.fall;
  hero.vy = Math.min(hero.vy + gravity * (hang ? 0.3 : 1) * dt, limit);
}

export function land(): void {
  motion.jumpBoost = false;
  motion.variableRise = false;
  motion.wallLock = 0;
}
