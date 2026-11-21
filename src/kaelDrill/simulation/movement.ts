import { clampHeroX, landingAt, moveHeroX, oneWayAt, wallSide } from "../../game/hero/terrain";
import { withCharms } from "../../game/skills/query";
import { progress } from "../../game/state";
import { approach } from "../../utils/math";
import { MOTION } from "../constants";
import { strikeTravel } from "./combat";
import type { Direction, Fighter, Side, TrainingInput } from "./model";

const DROP_SPEED = 36;

function slideSide(h: Fighter, dir: Direction): Direction {
  if (h.grounded || h.wallLock > 0 || h.dashTime > 0 || h.vy < 0) {
    return 0;
  }
  if (dir && (wallSide(h.x, h.y) === dir || clampHeroX(h.x + dir) === h.x)) {
    return dir;
  }
  return 0;
}

function jump(h: Fighter, wall: Direction): void {
  const boosted = !wall && h.dashTime > 0;
  h.jumpBuffer = 0;
  h.grace = 0;
  h.dashTime = 0;
  h.airDashActive = false;
  h.grounded = false;
  h.jumpBoost = boosted;
  h.vy = -MOTION.rise;
  h.swing = null;
  h.warp = null;
  h.parryAge = null;
  if (wall) {
    h.face = wall === 1 ? -1 : 1;
    h.vx = h.face * MOTION.wallKick;
    h.wallLock = MOTION.wallLock;
  } else if (boosted) {
    h.vx = h.face * MOTION.dashJump;
  }
}

function dash(h: Fighter, face: Side): void {
  h.swing = null;
  h.warp = null;
  h.parryAge = null;
  h.face = face;
  h.dashBuffer = 0;
  h.dashTime = MOTION.dashTime;
  h.dashReadyIn = MOTION.dashTime + withCharms("cooldown", MOTION.dashRecovery);
  h.airDashActive = !h.grounded;
  h.jumpBoost = false;
  if (h.airDashActive) {
    h.vy = 0;
    h.airDash = false;
    h.grace = 0;
  }
}

function steer(h: Fighter, dir: Direction, dt: number): void {
  if (h.stun > 0) {
    h.vx = approach(h.vx, 0, MOTION.groundBrake * 0.23 * dt);
    return;
  }
  if (h.warp) {
    h.vx = approach(h.vx, 0, (h.grounded ? 800 : 300) * dt);
    return;
  }
  if (h.guardAge !== null || h.spellRelease || h.skillCast) {
    h.vx = approach(h.vx, 0, MOTION.groundBrake * dt);
    return;
  }
  if (h.dashTime > 0) {
    const phase = h.dashTime / MOTION.dashTime;
    h.vx = h.face * (MOTION.dash + MOTION.dashBurst * (2 * phase - 1));
    return;
  }
  if (h.wallLock > 0) {
    return;
  }
  if (h.grounded && h.swing) {
    h.vx = h.face * strikeTravel(h.swing, dt);
    return;
  }
  if (dir && !h.swing) {
    h.face = dir;
  }
  if (h.jumpBoost && (dir === 0 || dir === Math.sign(h.vx))) {
    return;
  }
  h.jumpBoost = false;
  const rate = h.grounded ? (dir ? MOTION.groundAccel : MOTION.groundBrake) : dir ? MOTION.airAccel : MOTION.airBrake;
  const change = dir * MOTION.run * progress.stats.move - h.vx;
  h.vx += Math.sign(change) * Math.min(Math.abs(change), rate * dt);
}

function land(h: Fighter, y: number): void {
  h.y = y;
  h.vy = 0;
  h.grounded = true;
  h.droppedPlatform = null;
  h.airDash = true;
  h.airSlashUsed = false;
  h.wallLock = 0;
  h.jumpBoost = false;
  if (h.swing?.kind === "air" && h.swing.followUp !== "warp") {
    h.swing = null;
  }
}

function travel(h: Fighter, dir: Direction, jumpHeld: boolean, dt: number): void {
  const previousY = h.y;
  const nextX = h.x + h.vx * dt;
  h.x = moveHeroX(h.x, h.y, nextX);
  if (nextX !== h.x) {
    h.vx = 0;
    h.jumpBoost = false;
    h.dashTime = 0;
    h.airDashActive = false;
  }
  h.grounded = h.grounded && landingAt(h.x, h.y, h.y, 0, h.droppedPlatform) === h.y;
  if (!h.grounded && !h.airDashActive) {
    if (!jumpHeld && !h.warp && h.vy < -MOTION.release) {
      h.vy = -MOTION.release;
    }
    const hang = h.warp !== null && h.vy >= 0;
    const gravity = h.vy < 0 ? MOTION.riseGravity : MOTION.fallGravity;
    const limit = hang ? 60 : slideSide(h, dir) ? MOTION.wallSlide : MOTION.fall;
    h.vy = Math.min(h.vy + gravity * (hang ? 0.3 : 1) * dt, limit);
    const nextY = previousY + h.vy * dt;
    const floor = h.vy >= 0 ? landingAt(h.x, previousY, nextY, 0, h.droppedPlatform) : null;
    if (floor !== null) {
      land(h, floor);
    } else {
      h.y = nextY;
    }
    if (h.droppedPlatform && h.y > h.droppedPlatform.y + 1) {
      h.droppedPlatform = null;
    }
  }
  h.wall = slideSide(h, dir);
}

export function move(h: Fighter, input: TrainingInput, canCancel: boolean, dt: number): void {
  h.wallLock = Math.max(0, h.wallLock - dt);
  h.grace = h.grounded ? MOTION.jumpGrace : Math.max(0, h.grace - dt);
  h.dashTime = Math.max(0, h.dashTime - dt);
  h.airDashActive = h.airDashActive && h.dashTime > 0;
  if (canCancel) {
    if (input.drop && h.grounded) {
      const platform = oneWayAt(h.x, h.y);
      if (platform) {
        h.grounded = false;
        h.grace = 0;
        h.vy = DROP_SPEED;
        h.jumpBuffer = 0;
        h.droppedPlatform = platform;
      }
    }
    if (h.dashBuffer > 0 && h.dashTime === 0 && h.wallLock === 0 && (h.grounded || h.airDash)) {
      dash(h, input.dir || h.face);
    }
    const wall = slideSide(h, input.dir);
    if (h.jumpBuffer > 0 && (h.grace > 0 || wall)) {
      jump(h, wall);
    }
  }
  const dir = h.skillCast || h.warp ? 0 : input.dir;
  steer(h, dir, dt);
  travel(h, dir, h.skillCast !== null || input.jumpHeld, dt);
}
