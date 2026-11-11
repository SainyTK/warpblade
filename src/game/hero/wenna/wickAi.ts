import { PLATFORMS, W } from "../../../constants/stage";
import { BECKON } from "../../../constants/wenna/abilities";
import { WICK } from "../../../constants/wenna/wick";
import type { Enemy } from "../../../types/enemy";
import type { Wick } from "../../../types/wenna";
import { approach, clamp } from "../../../utils/math";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { skillValues } from "../../skills/query";
import { foesOnScreen } from "../../skills/targets";
import { game, hero, progress } from "../../state";
import { surfaceBelow } from "../../world";
import { biteFoe } from "./bite";
import { wennaHost } from "./memory";
import { packStrike } from "./packLunge";
import { isQuarry, quarries } from "./quarry";
import { endPlan, loadOf, plan, planOf, squash, tickSquash, type WickPlan } from "./wickMoves";
import { endWick, isUp } from "./wicks";
import { ownWicks } from "./wickWorld";

/** the floor a foe stands over: its feet for a walker, the floor under its body for a flier */
function floorOf(e: Enemy): number {
  const box = enemyBox(e);
  return surfaceBelow(enemyCenter(e)[0], box[3] - 1);
}

/** a Wick can bite this foe from the floor under it: walkers, and fliers low enough for a small hop */
function reachable(e: Enemy): boolean {
  if (e.hp <= 0) return false;
  return floorOf(e) - enemyBox(e)[3] <= WICK.biteRise + 2;
}

/** the floor a point stands on */
const floorAt = (x: number, y: number): number => surfaceBelow(x, y - 1);

/** the platform at this height that a Wick should aim for, or null for the main floor */
const platformAt = (x: number, y: number): (typeof PLATFORMS)[number] | null =>
  PLATFORMS.find((p) => p.y === y && x >= p.x0 - 30 && x <= p.x1 + 30) ?? null;

/** the foe a Wick goes after: a Quarry it can reach, else the nearest foe near it, else none; her guard Wick only
 *  takes foes near her */
function chooseTarget(w: Wick, guard: boolean): Enemy | null {
  const near = (e: Enemy): boolean => !guard || Math.abs(enemyCenter(e)[0] - hero.x) <= WICK.guardHold;
  for (const q of quarries()) if (reachable(q) && near(q)) return q;
  let best: Enemy | null = null;
  let bestD: number = WICK.seek;
  for (const e of foesOnScreen()) {
    if (!reachable(e) || !near(e)) continue;
    const [cx, cy] = enemyCenter(e);
    const d = Math.hypot(cx - w.x, cy - w.y + 6);
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

/** how far ahead its bite reaches: Bright Fangs adds to it */
const biteReach = (): number => WICK.biteReach + (skillValues("w_fangs").reach ?? 0);

/** a foe's body is inside the bite in front of the Wick */
function inBite(w: Wick, e: Enemy): boolean {
  const box = enemyBox(e);
  const x0 = w.face > 0 ? w.x - 2 : w.x - biteReach();
  const x1 = w.face > 0 ? w.x + biteReach() : w.x + 2;
  return box[0] < x1 && box[2] > x0 && box[3] >= w.y - WICK.height - WICK.biteRise && box[1] <= w.y;
}

/** where she stands: the floor under her feet */
const heroFloor = (): number => (hero.ground ? hero.y : floorAt(hero.x, hero.y));

/** the side her nearest foe stands on, or the way she faces with none on screen */
function threatSide(): number {
  let best = 0;
  let bestD = Number.POSITIVE_INFINITY;
  for (const e of foesOnScreen()) {
    const d = Math.abs(enemyCenter(e)[0] - hero.x);
    if (d < bestD) {
      best = Math.sign(enemyCenter(e)[0] - hero.x);
      bestD = d;
    }
  }
  return best || hero.face;
}

/** where an idle Wick stands guard: in front of her toward the nearest foe, spread between the near and far marks;
 *  with Procession's `beside` every other one guards her back */
function guardSpot(w: Wick, index: number): number {
  const beside = !!skillValues("w_procession").beside;
  const step = (WICK.guardFar - WICK.guardNear) / 2;
  const out = WICK.guardNear + (index % 3) * step + (w.id % 2) * 2;
  const side = beside && index % 2 === 1 ? -1 : 1;
  return hero.x + threatSide() * side * out;
}

/** Beckon's ring: places on both sides of her, near ones first */
export function ringSpot(slot: number): number {
  const side = slot % 2 === 0 ? 1 : -1;
  return hero.x + side * (BECKON.radius - 6 + Math.floor(slot / 2) * 9);
}

/** seconds between bites for this Wick on this foe: Bright Fangs, a Quarry, and the places she made bite faster */
function biteEvery(w: Wick, e: Enemy): number {
  const base = skillValues("w_fangs").every ?? WICK.biteEvery;
  const every = isQuarry(e) ? base * (WICK.quarryBiteEvery / WICK.biteEvery) : base;
  let rate = 1;
  for (const z of wennaHost.zones)
    if (Math.abs(w.x - z.x) <= z.half && Math.abs(w.y - z.y) < 8) rate = Math.max(rate, z.rate);
  if (w.extra) rate *= 1 + (skillValues("w_twinWick").bite ?? 0);
  return every / rate;
}

/** walking speed: her move stat, Procession, and Hunting Call's rush toward a Quarry */
function walkSpeed(w: Wick): number {
  let speed = WICK.walk * progress.stats.move * (1 + (skillValues("w_procession").wickWalk ?? 0));
  if (w.target && isQuarry(w.target)) speed *= 1 + (skillValues("w_quarry").rush ?? 0);
  return speed;
}

/** crouch, then hop up toward a floor this far above */
function hop(w: Wick, rise: number, dir: number): void {
  plan(w, {
    kind: "jump",
    vx: dir * walkSpeed(w) * 1.1,
    vy: -Math.sqrt(2 * WICK.gravity * (rise + 8)),
    left: loadOf("jump"),
  });
}

/** gather into a walk toward this speed, or brake out of it */
function pace(w: Wick, want: number, dt: number): void {
  w.vx = approach(w.vx, want, WICK.accel * dt);
}

/** step the Wick toward a spot on a floor: walk, hop up to a platform near enough, or drop down; it gathers into its
 *  walk and brakes before the spot, so it never starts or stops at full speed */
function steer(w: Wick, goalX: number, goalY: number, dt: number): void {
  if (!w.ground) return;
  const dx = goalX - w.x;
  const speed = walkSpeed(w);
  if (goalY < w.y - 2) {
    const rise = w.y - goalY;
    const p = platformAt(goalX, goalY);
    if (rise > WICK.hopUp || !p) {
      pace(w, 0, dt);
      return;
    }
    const near = clamp(w.x, p.x0 + 3, p.x1 - 3);
    const off = near - w.x;
    if (Math.abs(off) <= 18) {
      hop(w, rise, Math.sign(off) || Math.sign(dx));
      return;
    }
    pace(w, Math.sign(off) * speed, dt);
    w.face = Math.sign(off);
    return;
  }
  // the spot is below the platform it stands on: drop through once over it; off the platform's ends it walks off
  const under = PLATFORMS.some((p) => p.y === w.y && goalX >= p.x0 && goalX <= p.x1);
  if (goalY > w.y + 2 && under && Math.abs(dx) < 10) {
    w.dropping = true;
    w.y += 3;
    w.ground = false;
    return;
  }
  if (Math.abs(dx) < 1.5) {
    pace(w, 0, dt);
    return;
  }
  pace(w, Math.sign(dx) * Math.min(speed, Math.sqrt(2 * WICK.accel * Math.abs(dx))), dt);
  w.face = Math.sign(dx);
}

/** a leap flies a fixed arc and lands on its spot, whatever floors it passes */
function flyLeap(w: Wick, dt: number): void {
  const to = w.leapTo;
  w.leap -= dt;
  w.vy += WICK.gravity * dt;
  w.x += w.vx * dt;
  w.y += w.vy * dt;
  if (w.leap > 0 || !to) return;
  w.x = to.x;
  w.y = to.y;
  w.vx = 0;
  w.vy = 0;
  w.ground = true;
  w.leapTo = null;
  squash(w);
}

/** start a leap in an arc to a spot on a floor, landing after `seconds` */
export function leapTo(w: Wick, x: number, y: number, seconds: number): void {
  w.leap = seconds;
  w.leapTo = { x, y };
  w.vx = (x - w.x) / seconds;
  w.vy = (y - w.y - 0.5 * WICK.gravity * seconds * seconds) / seconds;
  w.ground = false;
  w.dropping = false;
  if (Math.abs(x - w.x) > 1) w.face = Math.sign(x - w.x);
}

/** a Wick in the air falls and lands on the first floor under it; on a floor it walks off an edge */
function move(w: Wick, dt: number): void {
  if (w.leap > 0) return flyLeap(w, dt);
  const x0 = w.x;
  w.x = clamp(w.x + w.vx * dt, 6, W - 6);
  if (w.ground) {
    const floor = floorAt(w.x, w.y);
    if (floor > w.y + 1) w.ground = false;
    return;
  }
  const y0 = w.y;
  w.vy += WICK.gravity * dt;
  w.y += w.vy * dt;
  if (w.vy < 0) return;
  const floor = surfaceBelow(w.x, y0 + (w.dropping ? 3 : 0));
  if (w.y >= floor) {
    w.y = floor;
    w.vy = 0;
    w.ground = true;
    w.dropping = false;
    squash(w);
    if (Math.abs(w.x - x0) < 1e-3) w.vx = 0;
  }
}

/** a Wick with a foe ahead in reach winds up to bite it, once its own timer allows */
function tryBite(w: Wick): void {
  if (w.bite > 0 || planOf(w)) return;
  const t = w.target;
  if (t && t.hp > 0) {
    const tx = enemyCenter(t)[0];
    if (Math.abs(tx - w.x) > 2) w.face = Math.sign(tx - w.x);
  }
  const prey = t && t.hp > 0 && inBite(w, t) ? t : (game.enemies.find((e) => e.hp > 0 && inBite(w, e)) ?? null);
  if (!prey) return;
  plan(w, { kind: "bite", foe: prey, left: loadOf("bite") });
  w.bite = biteEvery(w, prey);
}

/** a flier hovering over the guard's post, too high for a bite from the floor but within its leap */
function flierOverhead(w: Wick): Enemy | null {
  const reach = biteReach();
  for (const e of game.enemies) {
    if (e.hp <= 0 || !kindOf(e.type).flies) continue;
    const box = enemyBox(e);
    const above = w.y - box[3];
    if (above < WICK.biteRise || above > WICK.guardLeap) continue;
    if (box[2] < w.x - reach || box[0] > w.x + reach) continue;
    return e;
  }
  return null;
}

/** the guard crouches and leaps straight up off its post at a flier over it; it bites at the top and lands back where
 *  it stood */
function guardLeap(w: Wick): void {
  if (!w.ground || w.bite > 0 || w.leap > 0 || planOf(w)) return;
  const e = flierOverhead(w);
  if (!e) return;
  const box = enemyBox(e);
  const rise = w.y - box[3] - WICK.height + 2;
  w.face = Math.sign(enemyCenter(e)[0] - w.x) || w.face;
  w.target = e;
  plan(w, { kind: "jump", vx: 0, vy: -Math.sqrt(2 * WICK.gravity * Math.max(4, rise)), left: loadOf("jump") });
}

/** the plan's wind-up is over: the bite lands, the jump leaves the floor, Pack Lunge leaps and then strikes */
function act(w: Wick, p: WickPlan): void {
  if (p.kind === "jump") {
    endPlan(w);
    Object.assign(w, { vx: p.vx, vy: p.vy, ground: false });
    return;
  }
  if (p.kind === "pack" && !p.leaping) {
    const cx = enemyCenter(p.foe)[0];
    p.leaping = true;
    p.left = WICK.packLeap;
    leapTo(w, w.x + (cx - w.x) * WICK.packReach, w.y, WICK.packLeap);
    return;
  }
  endPlan(w);
  if (p.foe.hp <= 0) return;
  if (p.kind === "pack") return packStrike(w, p.foe);
  if (p.kind === "call") return biteFoe(w, p.foe);
  const prey = inBite(w, p.foe) ? p.foe : game.enemies.find((e) => e.hp > 0 && inBite(w, e));
  if (prey) biteFoe(w, prey);
}

/** a Wick winding up holds its ground, braking out of any walk, until the plan acts */
function runPlan(w: Wick, p: WickPlan, dt: number): void {
  p.left -= dt;
  if (w.ground && w.leap <= 0) pace(w, 0, dt);
  if (p.left <= 0) act(w, p);
}

/** where a Wick wants to be now: in Beckon's ring, beside its target, or on guard in front of her. Her guard Wick
 *  only leaves its post to hold a ground foe near her; it bites fliers from where it stands. */
function goal(w: Wick, index: number, guard: boolean): [number, number] {
  if (w.ring > 0) return [ringSpot(w.slot), heroFloor()];
  const t = w.target;
  if (!t || (guard && kindOf(t.type).flies)) return [guardSpot(w, index), heroFloor()];
  const box = enemyBox(t);
  const cx = (box[0] + box[2]) / 2;
  const side = Math.sign(w.x - cx) || -hero.face;
  const stand = (box[2] - box[0]) / 2 + WICK.half + (w.id % 3) * 3;
  const floor = floorOf(t);
  // already this close on the foe's floor: it holds its ground, never backs off from a foe pressing into it
  if (Math.abs(w.y - floor) < 2 && Math.abs(w.x - cx) <= stand) return [w.x, floor];
  return [cx + side * stand, floor];
}

/** how fast a Wick burns down: Procession slows it while she walks, Eternal Flame stops it */
function burnRate(): number {
  if (skillValues("w_tallow").eternal) return 0;
  const walking = hero.state === "walk" && hero.ground;
  return walking ? (skillValues("w_procession").slowBurn ?? 1) : 1;
}

/** one step of one of her Wicks: its timers, its end, its target, its walk and its bite */
function stepWick(w: Wick, index: number, guard: boolean, dt: number): void {
  w.tended = game.t;
  w.t += dt;
  w.lunge = Math.max(0, w.lunge - dt);
  w.hurt = Math.max(0, w.hurt - dt);
  w.guard = Math.max(0, w.guard - dt);
  w.shoved = Math.max(0, w.shoved - dt);
  w.ring = Math.max(0, w.ring - dt);
  w.great = Math.max(0, w.great - dt);
  tickSquash(w, dt);
  if (w.melt >= 0) {
    w.melt += dt;
    return;
  }
  w.life -= dt * burnRate();
  if (w.hp <= 0) return endWick(w, "hp");
  if (w.life <= 0) return endWick(w, "life");
  if (!isUp(w)) return;
  w.bite = Math.max(0, w.bite - dt);
  if (guard || !w.target || w.target.hp <= 0 || !reachable(w.target) || !isQuarry(w.target))
    w.target = chooseTarget(w, guard);
  const held = planOf(w);
  if (held) runPlan(w, held, dt);
  else if (w.leap <= 0) {
    const [gx, gy] = goal(w, index, guard);
    steer(w, gx, gy, dt);
  }
  if (guard) guardLeap(w);
  move(w, dt);
  tryBite(w);
}

/** every Wick of hers takes its step, the one nearest her as her guard; a Wick nobody tends any more (its owner fell)
 *  is let go */
export function stepWicks(dt: number): void {
  const mine = ownWicks();
  const up = mine.filter((w) => w.melt < 0 && isUp(w));
  const guard = up.length >= 2 ? up.reduce((a, b) => (Math.abs(b.x - hero.x) < Math.abs(a.x - hero.x) ? b : a)) : null;
  let index = 0;
  for (const w of mine) {
    if (game.t - w.tended > WICK.untended) endWick(w, "gone");
    stepWick(w, w.target ? 0 : index++, w === guard, dt);
  }
}

/** her Wicks all melt at once: she fell, or the run ended */
export function meltAll(): void {
  for (const w of ownWicks()) endWick(w, "gone");
}
