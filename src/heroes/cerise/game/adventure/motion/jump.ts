import { setState } from "../../../../../game/hero/actions";
import { blowsDone, endMove } from "../../../../../game/hero/combo";
import { carryDashIntoJump } from "../../../../../game/hero/dash";
import { jump } from "../../../../../game/hero/jump";
import { landingAt, moveHeroX, oneWayAt } from "../../../../../game/hero/terrain";
import { isHeld, pressAge, take, use } from "../../../../../game/input";
import { emitSkillEvent } from "../../../../../game/skills/events";
import { hero } from "../../../../../game/state";
import { dust } from "../../../../../game/world";
import { MOTION } from "../../../../../kaelDrill/constants";
import { motion } from "./state";
import { wallContact } from "./travel";

function landingSoon(dir: number): boolean {
  if (hero.vy < 0) return false;
  const time = MOTION.buffer;
  const end = hero.y + hero.vy * time + (MOTION.fallGravity * time ** 2) / 2;
  const x = moveHeroX(hero.x, hero.y, hero.x + (dir ? hero.vx : 0) * time);
  return landingAt(x, hero.y, end, hero.drop, hero.droppedPlatform) !== null;
}

function wallSoon(dir: number): boolean {
  if (!dir || hero.vy < -MOTION.riseGravity * MOTION.buffer || hero.vx * dir < 0) return false;
  const end = hero.x + dir * Math.max(MOTION.run, Math.abs(hero.vx)) * MOTION.buffer;
  return moveHeroX(hero.x, hero.y, end) !== end;
}

function leap(wall: number, boost: boolean): void {
  motion.jumpBuffer = 0;
  motion.grace = 0;
  motion.variableRise = true;
  motion.jumpBoost = boost;
  hero.ground = false;
  hero.jumps = Math.max(1, hero.jumps);
  hero.vy = -MOTION.rise;
  hero.liftTop = hero.y - MOTION.rise ** 2 / (2 * MOTION.riseGravity);
  setState("jump");
  if (wall) {
    hero.face = -wall;
    hero.vx = hero.face * MOTION.wallKick;
    motion.wallLock = MOTION.wallLock;
  } else if (boost) {
    hero.vx = hero.face * MOTION.dashJump;
  }
  dust(hero.x, hero.y, 4);
  emitSkillEvent({ type: "jump", air: wall !== 0 });
}

export function readJump(dir: number, free: boolean): void {
  const wall = !hero.ground && hero.vy >= 0 && motion.wallLock === 0 ? wallContact() : 0;
  const dash = hero.state === "dash";
  const followThrough = blowsDone();
  const canJump = free || followThrough || dash;
  const supported = hero.ground || motion.grace > 0 || wall !== 0;
  if (!dash && !supported && !motion.jumpBuffer && hero.jumps < 2 && !landingSoon(dir) && !wallSoon(dir)) {
    if (canJump && pressAge("up") >= 0) {
      motion.variableRise = false;
      use("up", jump);
    }
    return;
  }
  if (take("up")) motion.jumpBuffer = MOTION.buffer;
  if (!canJump || !supported || !motion.jumpBuffer) return;
  if (dash) carryDashIntoJump();
  if (followThrough) endMove();
  const platform = hero.ground && isHeld("down") ? oneWayAt(hero.x, hero.y) : undefined;
  if (platform) {
    motion.grace = 0;
    motion.jumpBuffer = 0;
    hero.droppedPlatform = platform;
    hero.ground = false;
    hero.jumps = 1;
    return;
  }
  leap(wall, dash && wall === 0);
}
