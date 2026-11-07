import { HERO_MOVE } from "../../../constants/combat";
import { ENEMIES } from "../../../constants/enemies";
import { HOOK, REEL, SWING } from "../../../constants/orrin/hook";
import { W } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { LatchKind } from "../../../types/orrin";
import type { Point } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxHit, heroBox, hitStop, shake, surfaceBelow } from "../../world";
import { setState } from "../actions";
import { travelEnded } from "../travelEnd";
import { bleed, frictionBurn } from "./blowSkills";
import { orrin, orrinHost } from "./memory";
import { reelSnap } from "./reelSnap";

const PUMP = "o_pump";
/** the shared mover keeps him this far inside the stage's sides */
const WALL = 8;
const KICK = "o_pendulumkick";

/** the hand the chain hangs from while he swings, world pixels */
export const swingHand = (): Point => ({ x: hero.x, y: hero.y - HOOK.grip });

/** the longest chain from this latch whose arc still clears the floor under him */
export const swingRoom = (at: Point): number => surfaceBelow(hero.x, hero.y) - HOOK.grip - HOOK.clearance - at.y;

/** how long the chain may be from this latch: never past the hook's range, and short enough that the bottom of the
 *  arc clears the floor under the latch */
function chainLength(at: Point, from: Point): number {
  const most = swingRoom(at);
  const reach = Math.hypot(from.x - at.x, from.y - at.y);
  const length = Math.min(reach, HOOK.range + (skillValues(PUMP).range ?? 0), most);
  return Math.max(Math.min(HOOK.minLength, most), Math.max(10, length));
}

/** an air bite holds this long: Pendulum Pump lengthens it */
const biteTime = (): number => withCharms("duration", skillValues(PUMP).bite ?? HOOK.bite);

/** the hook holds: swing under the latch, yanked onto the arc first when the chain is shorter than the gap */
export function startSwing(kind: LatchKind, at: Point): void {
  const h = hero;
  const hand = swingHand();
  orrin.latch = kind;
  orrin.latchAt = at;
  orrin.length = chainLength(at, hand);
  orrin.latchT = 0;
  orrin.biteLeft = kind === "air" ? biteTime() : 0;
  orrin.reeling = false;
  orrin.reelBase = 0;
  orrin.kicks = 0;
  orrinHost.kicked = [];
  const gap = Math.hypot(hand.x - at.x, hand.y - at.y);
  if (h.ground || gap > orrin.length + 1) {
    const d = gap || 1;
    orrin.yankTo = {
      x: at.x + ((hand.x - at.x) / d) * orrin.length,
      y: at.y + ((hand.y - at.y) / d) * orrin.length + HOOK.grip,
    };
    // the yank lifts him on this very step, so the floor never takes him back before it starts
    h.vx = (orrin.yankTo.x - h.x) / SWING.yankTime;
    h.vy = (orrin.yankTo.y - h.y) / SWING.yankTime;
  } else orrin.yankTo = null;
  h.ground = false;
  setState("swing");
}

/** the unit tangent of the arc at his hand, pointing toward this side */
function tangent(side: number): [number, number] {
  const at = orrin.latchAt as Point;
  const hand = swingHand();
  const rx = hand.x - at.x;
  const ry = hand.y - at.y;
  const d = Math.hypot(rx, ry) || 1;
  let tx = -ry / d;
  let ty = rx / d;
  if (Math.sign(tx) !== side && tx !== 0) {
    tx = -tx;
    ty = -ty;
  }
  return [tx, ty];
}

/** the yank from the floor: straight to his place on the arc, then off along it toward his facing */
function runYank(dt: number): boolean {
  const to = orrin.yankTo;
  if (!to) return false;
  const left = SWING.yankTime - orrin.latchT;
  if (left <= dt) {
    orrin.yankTo = null;
    hero.x = to.x;
    hero.y = to.y;
    const [tx, ty] = tangent(hero.face);
    hero.vx = tx * SWING.yankSpeed;
    hero.vy = ty * SWING.yankSpeed;
    return true;
  }
  hero.vx = (to.x - hero.x) / left;
  hero.vy = (to.y - hero.y) / left;
  return true;
}

/** the reel: L held pulls the chain in, and the swing speeds up as it shortens, up to a cap; Reel Snap answers */
function runReel(dt: number): void {
  const snap = skillValues("o_reelsnap");
  const reeling = isHeld("dash") && orrin.length > HOOK.minLength && hero.stamina > 0;
  if (!reeling) {
    orrin.reeling = false;
    return;
  }
  const speed = Math.hypot(hero.vx, hero.vy);
  if (!orrin.reeling) {
    orrin.reeling = true;
    orrin.snapped = false;
    orrin.reelBase = Math.max(60, speed);
    sfx.rattle();
  }
  hero.stamina = Math.max(0, hero.stamina - REEL.cost * dt);
  hero.staminaWait = 0.4;
  const rate = (snap.reel ?? REEL.speed) * progress.stats.move;
  const next = Math.max(HOOK.minLength, orrin.length - rate * dt);
  const k = orrin.length / next;
  orrin.length = next;
  const cap = orrin.reelBase * REEL.boost;
  const faster = Math.min(cap, speed * k);
  if (speed > 1) {
    hero.vx *= faster / speed;
    hero.vy *= faster / speed;
  }
  if (snap.power && faster >= orrin.reelBase * snap.at) reelSnap();
}

/** the kick of his body on a foe he swings through, harder the faster he goes */
function swingKick(e: Enemy, speed: number): void {
  const v = skillValues(KICK);
  const power = Math.min(SWING.kickCap, (SWING.kick * speed) / SWING.kickPer) * (1 + (v.power ?? 0));
  const burning = e.burn > 0 ? 1 + (skillValues("o_friction").kick ?? 0) : 1;
  const ux = hero.vx / (speed || 1);
  const uy = hero.vy / (speed || 1);
  const launchable = ENEMIES[e.type].launchable;
  dealDamage(e, progress.stats.ad * power * burning, {
    fromX: hero.x - ux * 10,
    kx: ux * 160,
    ky: uy * 80,
    launch: v.launch && launchable ? -170 : undefined,
    stun: v.stun || undefined,
    heavy: true,
    melee: true,
  });
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, Math.sign(ux) || hero.face, true));
  hitStop(0.04);
  shake(0.1, 1.6);
  sfx.hit(true, 1.1);
  if (skillValues("o_barbs").kick) bleed(e, 1);
  frictionBurn(e);
  orrin.kicks++;
  emitSkillEvent({ type: "swingKick", foe: e, speed });
}

/** the speed his swing kicks start at: Pendulum Kick lowers it */
export const kickFrom = (): number => skillValues(KICK).from ?? SWING.kickFrom;

/** his body kicks each foe he passes through fast enough, once a swing (twice with Pendulum Kick at level 6) */
export function kickThrough(): void {
  const speed = Math.hypot(hero.vx, hero.vy);
  if (speed < kickFrom()) return;
  const box = heroBox();
  const twice = (skillValues(KICK).twice ?? 0) > 0;
  let kicked = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    const times = orrinHost.kicked.filter((k) => k === e).length;
    if (times >= (twice ? 2 : 1)) continue;
    if (times === 1 && Math.sign(hero.vx) === Math.sign(e.x - (orrin.latchAt?.x ?? e.x))) continue;
    orrinHost.kicked = [...orrinHost.kicked, e];
    swingKick(e, speed);
    kicked++;
  }
  if (kicked >= 2 && skillValues(KICK).hook) orrin.hooks++;
}

/**
 * One step of the pendulum: gravity and the pump along the arc, then back onto the circle with the speed along the
 * chain taken out. The kit sets the velocity that carries him to his next place on the circle; the shared mover
 * applies it.
 */
function pendulum(dt: number, dir: number): void {
  const h = hero;
  const at = orrin.latchAt as Point;
  const hand = swingHand();
  let rx = hand.x - at.x;
  let ry = hand.y - at.y;
  let d = Math.hypot(rx, ry) || 1;
  // swinging into the stage's side stops the swing there, and he falls back along the arc
  if ((h.x <= WALL && h.vx < 0) || (h.x >= W - WALL && h.vx > 0)) {
    h.vx = 0;
    h.vy = Math.max(0, h.vy);
  }
  // speed along the chain is taken out: the chain is taut
  const radial = (h.vx * rx + h.vy * ry) / d;
  if (radial > 0) {
    h.vx -= (radial * rx) / d;
    h.vy -= (radial * ry) / d;
  }
  h.vy += HERO_MOVE.gravity * dt;
  if (dir) {
    const [tx, ty] = tangent(dir);
    const pump = SWING.pump * (1 + (skillValues(PUMP).pump ?? 0)) * progress.stats.move;
    h.vx += tx * pump * dt;
    h.vy += ty * pump * dt;
  }
  const speed = Math.hypot(h.vx, h.vy);
  if (speed > SWING.maxSpeed) {
    h.vx *= SWING.maxSpeed / speed;
    h.vy *= SWING.maxSpeed / speed;
  }
  const nx = hand.x + h.vx * dt;
  const ny = hand.y + h.vy * dt;
  rx = nx - at.x;
  ry = ny - at.y;
  d = Math.hypot(rx, ry) || 1;
  // slack chain inside the circle swings free; a taut one holds him on it
  if (d < orrin.length) return;
  const px = at.x + (rx / d) * orrin.length;
  const py = at.y + (ry / d) * orrin.length;
  h.vx = (px - hand.x) / dt;
  h.vy = (py - hand.y) / dt;
}

/** the chain lets go: his speed is kept, a release rising in the forward half of the arc flings him harder */
export function letGo(hop: boolean): void {
  const h = hero;
  const at = orrin.latchAt;
  const speed = Math.hypot(h.vx, h.vy);
  const forward = !!at && Math.sign(h.x - at.x) === Math.sign(h.vx);
  const fling = h.vy < 0 && forward && speed > 60;
  if (fling) {
    const boost = 1 + SWING.fling + (skillValues(PUMP).fling ?? 0) + orrin.flingBoost;
    h.vx *= boost;
    h.vy *= boost;
  }
  if (hop) h.vy -= SWING.hopUp;
  orrin.flingBoost = 0;
  orrin.latch = null;
  orrin.latchAt = null;
  orrin.yankTo = null;
  orrin.biteLeft = 0;
  orrin.reeling = false;
  orrin.sinceRelease = 0;
  orrin.releaseSpeed = Math.hypot(h.vx, h.vy);
  orrin.flung = orrin.releaseSpeed > SWING.kickFrom;
  orrin.bestKicks = Math.max(orrin.bestKicks, orrin.kicks);
  h.perfectUsed = false;
  setState("fly");
  emitSkillEvent({ type: "release", speed: orrin.releaseSpeed, fling });
  emitSkillEvent({ type: "dash", dir: Math.sign(h.vx) || h.face, foes: orrinHost.kicked });
  travelEnded();
}

/** the swing ends on the floor: a landing, with no fling */
export function endSwingOnFloor(): void {
  orrin.bestKicks = Math.max(orrin.bestKicks, orrin.kicks);
  orrin.latch = null;
  orrin.latchAt = null;
  orrin.yankTo = null;
  orrin.climbTo = null;
  orrin.biteLeft = 0;
  orrin.reeling = false;
}

/** let go at once and without a fling: hurt, down, or the run's end */
export function dropChain(): void {
  endSwingOnFloor();
  orrin.flight = null;
  orrinHost.zipFoe = null;
}

/**
 * The swing: the yank onto the arc, then the pendulum he pumps with Left and Right and reels in with L. He lets go when
 * K is let go or an air bite's tear closes; Plumb Drop lets go downward with Down held.
 */
export function runSwing(dt: number, dir: number): void {
  const h = hero;
  orrin.latchT += dt;
  if (orrin.latch === "air") {
    orrin.biteLeft -= dt;
    if (orrin.biteLeft <= 0) return letGo(false);
  }
  if (orrin.latchT > SWING.yankTime * 0.5 && !isHeld("warp")) return letGo(false);
  if (runYank(dt)) return;
  pendulum(dt, dir);
  runReel(dt);
  if (Math.abs(h.vx) > 20) h.face = Math.sign(h.vx);
  kickThrough();
}
