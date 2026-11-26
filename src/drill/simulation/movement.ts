import { LAND_SOUND_SPEED } from "../../constants/audio";
import { clampHeroX, landingAt, moveHeroX, oneWayAt, wallSide } from "../../game/hero/terrain";
import { withBuild } from "../../game/skills/query";
import { progress } from "../../game/state";
import { sfx } from "../../services/audio";
import type { Direction, DrillInput, DrillMotion, Fighter, Session, Side } from "../../types/drill";
import { approach } from "../../utils/math";
import { strikeTravel } from "./combat";

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

function jump(h: Fighter, wall: Direction, motion: DrillMotion): void {
  const boosted = !wall && h.dashTime > 0;
  h.jumpBuffer = 0;
  h.grace = 0;
  h.dashTime = 0;
  h.airDashActive = false;
  h.grounded = false;
  h.jumpBoost = boosted;
  h.vy = -motion.rise;
  sfx.jump();
  h.swing = null;
  h.warp = null;
  h.parryAge = null;
  if (wall) {
    h.face = wall === 1 ? -1 : 1;
    h.vx = h.face * motion.wallKick;
    h.wallLock = motion.wallLock;
  } else if (boosted) {
    h.vx = h.face * motion.dashJump;
  }
}

function dash(h: Fighter, face: Side, motion: DrillMotion): void {
  h.swing = null;
  h.warp = null;
  h.parryAge = null;
  h.face = face;
  h.dashBuffer = 0;
  h.dashTime = motion.dashTime;
  h.dashReadyIn = motion.dashTime + withBuild("cooldown", motion.dashRecovery);
  h.airDashActive = !h.grounded;
  h.jumpBoost = false;
  if (h.airDashActive) {
    h.vy = 0;
    h.airDashes--;
    h.grace = 0;
  }
}

function steer(session: Session, dir: Direction, dt: number): void {
  const h = session.fighter;
  const motion = session.motion;
  if (h.stun > 0) {
    h.vx = approach(h.vx, 0, motion.groundBrake * 0.23 * dt);
    return;
  }
  if (h.warp) {
    h.vx = approach(h.vx, 0, (h.grounded ? 800 : 300) * dt);
    return;
  }
  if (h.guardAge !== null || h.spellRelease || h.skillCast) {
    h.vx = approach(h.vx, 0, motion.groundBrake * dt);
    return;
  }
  if (h.dashTime > 0) {
    const phase = h.dashTime / motion.dashTime;
    h.vx = h.face * (motion.dash + motion.dashBurst * (2 * phase - 1));
    return;
  }
  if (h.wallLock > 0) {
    return;
  }
  if (h.grounded && h.swing) {
    h.vx = h.face * strikeTravel(session.profile, h.swing, dt);
    return;
  }
  if (dir && !h.swing) {
    h.face = dir;
  }
  if (h.jumpBoost && (dir === 0 || dir === Math.sign(h.vx))) {
    return;
  }
  h.jumpBoost = false;
  const rate = h.grounded ? (dir ? motion.groundAccel : motion.groundBrake) : dir ? motion.airAccel : motion.airBrake;
  const change = dir * motion.run * progress.stats.move - h.vx;
  h.vx += Math.sign(change) * Math.min(Math.abs(change), rate * dt);
}

function land(session: Session, y: number): void {
  const h = session.fighter;
  if (h.vy > LAND_SOUND_SPEED) {
    sfx.land();
  }
  h.y = y;
  h.vy = 0;
  h.grounded = true;
  h.droppedPlatform = null;
  h.airDashes = 1 + session.modifiers.airDashes;
  h.airSlashes = 0;
  h.wallLock = 0;
  h.jumpBoost = false;
  if (h.swing?.kind === "air" && h.swing.followUp !== "warp") {
    h.swing = null;
  }
}

function travel(session: Session, dir: Direction, jumpHeld: boolean, dt: number): void {
  const h = session.fighter;
  const motion = session.motion;
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
    if (!jumpHeld && !h.warp && h.vy < -motion.release) {
      h.vy = -motion.release;
    }
    const hang = h.warp !== null && h.vy >= 0;
    const gravity = h.vy < 0 ? motion.riseGravity : motion.fallGravity;
    const limit = hang ? 60 : slideSide(h, dir) ? motion.wallSlide : motion.fall;
    h.vy = Math.min(h.vy + gravity * (hang ? 0.3 : 1) * dt, limit);
    const nextY = previousY + h.vy * dt;
    const floor = h.vy >= 0 ? landingAt(h.x, previousY, nextY, 0, h.droppedPlatform) : null;
    if (floor !== null) {
      land(session, floor);
    } else {
      h.y = nextY;
    }
    if (h.droppedPlatform && h.y > h.droppedPlatform.y + 1) {
      h.droppedPlatform = null;
    }
  }
  h.wall = slideSide(h, dir);
}

export function move(session: Session, input: DrillInput, canCancel: boolean, dt: number): void {
  const h = session.fighter;
  const motion = session.motion;
  h.wallLock = Math.max(0, h.wallLock - dt);
  h.grace = h.grounded ? motion.jumpGrace : Math.max(0, h.grace - dt);
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
    if (h.dashBuffer > 0 && h.dashTime === 0 && h.wallLock === 0 && (h.grounded || h.airDashes > 0)) {
      dash(h, input.dir || h.face, session.motion);
    }
    const wall = slideSide(h, input.dir);
    if (h.jumpBuffer > 0 && (h.grace > 0 || wall)) {
      jump(h, wall, session.motion);
    }
  }
  const dir = h.skillCast || h.warp ? 0 : input.dir;
  steer(session, dir, dt);
  travel(session, dir, h.skillCast !== null || input.jumpHeld, dt);
}
