import { COST, WARP } from "../../constants/combat";
import { SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import type { WarpTarget } from "../../types/hero";
import type { WarpTune } from "../../types/moveset";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { createSlash } from "../effects/slash";
import { createThrownWeapon } from "../effects/thrownWeapon";
import { enemyCenter, walks } from "../enemies/enemy";
import { meleeHit } from "../meleeHit";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { emitSkillEvent } from "../skills/events";
import { game, hero, ponytail, progress, scarf } from "../state";
import { foesOnSegment } from "../ultimates/segmentHits";
import { boxAhead, newSwing, surfaceBelow } from "../world";
import { setState } from "./actions";
import { leaveAfterimages } from "./afterimages";
import { deny } from "./deny";
import { kit } from "./kits";
import { cutForSharedAction, maySharedAct } from "./sharedCut";
import { travelEnded } from "./travelEnd";

/**
 * The warp move every hero shares (J held): the hero throws their weapon at the nearest foe ahead, warps to it and
 * strikes as they arrive, harder the farther they came. A ranged hero throws away from the nearest foe instead and
 * strikes it from where they land. The throw, its flight, its cost, its recharge and the arrival blow's power are the
 * same for every hero; the kit's `warp` style draws the weapon and adds its own small extra (docs/moveset-design.md).
 */

/** the shared arrival blow: a slash in front that knocks the foe up and back */
const WARP_SLASH = { cx: 2, cy: -20, R: 24, sy: 0.5, rot: -0.5, a0: -2.6, a1: 0.8, W: 10, hold: 0.06, trail: 0.24 };
/** a ranged hero lands no closer than this to a wall; with no room behind, they land past the foe */
const RANGED_ROOM = 40;

/** warps ready to throw; each co-op seat has its own */
const charges = { left: 1 };
rememberPerSeat(objectMemory(charges));

const tune = (): WarpTune => kit().warp.tune?.() ?? {};
export const warpCost = (): number => tune().cost ?? COST.warp;
export const warpCooldown = (): number => tune().recharge ?? WARP.cooldown;
const maxCharges = (): number => tune().charges ?? 1;
/** a warp is ready to throw */
export const warpReady = (): boolean => charges.left > 0;
/** share of the warp's recharge still to run, 0 while a charge is ready */
export const warpRecharge = (): number => (warpReady() ? 0 : hero.warpCd / warpCooldown());

/** spend a warp charge; the recharge starts if it was not already running */
export function spendWarpCharge(): void {
  charges.left--;
  if (hero.warpCd <= 0) hero.warpCd = warpCooldown();
}

/** a charge comes back each time the recharge runs out, until all are back */
export function tickWarp(): void {
  const max = maxCharges();
  if (charges.left > max) charges.left = max;
  if (charges.left < max && hero.warpCd <= 0) {
    charges.left++;
    if (charges.left < max) hero.warpCd = warpCooldown();
  }
}

/** a fresh run: one charge ready */
export function resetWarp(): void {
  charges.left = 1;
}

/** the nearest standing foe, ahead only or on either side, within `reach` */
function nearestFoe(ahead: boolean, reach: number): Enemy | null {
  const chest = hero.y - 20;
  let best: Enemy | null = null;
  let bestD = reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (ahead && (ex - hero.x) * hero.face < -4) continue;
    const d = Math.hypot(ex - hero.x, ey - chest);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

/** a ranged hero's throw: away from the nearest foe, or past it when a wall is close behind */
function rangedTarget(): WarpTarget {
  const foe = nearestFoe(false, WARP.reach * 1.5);
  const side = foe ? Math.sign(foe.x - hero.x) || hero.face : hero.face;
  const away = clamp(hero.x - side * WARP.fallback, 12, W - 12);
  const x =
    Math.abs(away - hero.x) >= RANGED_ROOM ? away : clamp((foe?.x ?? hero.x) + side * WARP.fallback * 0.6, 12, W - 12);
  return { x, y: hero.y - 18, aim: foe ?? undefined };
}

/** where the throw goes: the nearest foe ahead, or a point ahead; a ranged hero's away */
export function findWarpTarget(): WarpTarget {
  if (kit().warp.ranged) return rangedTarget();
  const foe = nearestFoe(true, WARP.reach);
  if (foe) {
    const [x, y] = enemyCenter(foe);
    return { enemy: foe, x, y };
  }
  return { x: clamp(hero.x + hero.face * WARP.fallback, 12, W - 12), y: hero.y - 18 };
}

/** J held: throw if a warp is ready and paid for; a press while it recharges or short of MP is refused at once */
export function pressWarp(): boolean {
  if (!warpReady()) {
    deny("warp");
    return true;
  }
  if (!maySharedAct()) return false;
  if (hero.mp < warpCost()) {
    deny("mp");
    return true;
  }
  cutForSharedAction();
  startThrow();
  return true;
}

function startThrow(): void {
  hero.mp -= warpCost();
  spendWarpCharge();
  const target = findWarpTarget();
  if (Math.abs(target.x - hero.x) > 2) hero.face = Math.sign(target.x - hero.x);
  hero.warpTarget = target;
  setState("throw");
  sfx.swing(0.8);
}

/** the weapon leaves the hand; with a path skill it cuts every foe it passes */
export function releaseWeapon(): void {
  if (!hero.warpTarget) return;
  hero.hasSword = false;
  const path = tune().path;
  const struck = new Set<Enemy>();
  const power = progress.stats.ad * (path ?? 0);
  const onMove = (ax: number, ay: number, bx: number, by: number): void => {
    if (!path) return;
    for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
      struck.add(e);
      dealDamage(e, power, { fromX: ax, kx: Math.sign(bx - ax) * 40, ky: -30 });
      game.fx.push(createImpact(...enemyCenter(e), Math.sign(bx - ax) || 1, false, SPARKS.crystal));
    }
  };
  const body = kit().warp.drawThrown;
  hero.sword = createThrownWeapon(hero.x + hero.face * 13, hero.y - 22, hero.warpTarget, body, onMove);
  setState("throwWait");
}

/** the hero appears at (nx, ny); `told` lets the skills hear of it, which a chained arrival does not */
export function arrive(nx: number, ny: number, foe: Enemy | null, told = true): void {
  const ox = hero.x;
  const oy = hero.y;
  leaveAfterimages(ox, oy, nx, ny);
  scarf.shift(nx - ox, ny - oy);
  ponytail.shift(nx - ox, ny - oy);
  Object.assign(hero, { x: nx, y: ny, vx: 0, vy: 0, sword: null, hasSword: true });
  hero.ground = Math.abs(ny - surfaceBelow(nx, ny - 1)) < 0.5;
  sfx.warp();
  travelEnded();
  if (told) emitSkillEvent({ type: "warp", x: nx, y: ny, foe });
}

/** the arrival's slash in front, in the hero's colours */
export function warpSlash(): void {
  game.fx.push(createSlash(hero.x, hero.y, hero.face, WARP_SLASH));
}

/** the shared arrival blow: a slash in front that knocks foes up and back */
export function sharedWarpStrike(power: number, _foe: Enemy | null, sureCrit: boolean): void {
  warpSlash();
  meleeHit([boxAhead(-6, -40, 30, 2)], { power, kx: 160, ky: -80, big: true, sureCrit });
}

/** the warp's power as a multiple of attack damage, for a hero whose warp grows with ability power */
const statShare = (): number => (kit().warp.stat === "ap" ? progress.stats.ap / Math.max(1, progress.stats.ad) : 1);

/** the arrival: the hero cannot be touched for a moment and strikes with the kit's blow or the shared one */
export function strikeOnArrival(power: number, foe: Enemy | null, sureCrit = false): void {
  const style = kit().warp;
  setState("warpStrike");
  hero.inv = Math.max(hero.inv, 0.3);
  newSwing();
  (style.strike ?? sharedWarpStrike)(power * statShare(), foe, sureCrit);
  style.arrived?.(foe);
}

/** the arrival blow's power: the warp skill's or the shared one, and more the farther the hero travelled */
export function warpPower(distance: number): number {
  const t = tune();
  const bonus = Math.min(t.cap ?? WARP.maxDistanceBonus, distance * (t.perPx ?? WARP.powerPerPixel));
  return (t.strike ?? WARP.power) + bonus;
}

/** where the hero stands beside a foe they warp to, facing it */
export function besideFoe(enemy: Enemy, from: number): [number, number] {
  const [ex, ey] = enemyCenter(enemy);
  hero.face = Math.sign(ex - from) || hero.face;
  return [clamp(ex - hero.face * 13, 8, W - 8), Math.min(walks(enemy) ? enemy.y : ey + 18, GROUND)];
}

/** the hero warps beside a foe and strikes it, harder the farther they came */
export function warpBeside(enemy: Enemy, told: boolean): void {
  const ox = hero.x;
  const oy = hero.y;
  const [nx, ny] = besideFoe(enemy, ox);
  arrive(nx, ny, enemy, told);
  strikeOnArrival(warpPower(Math.hypot(nx - ox, ny - oy)), enemy);
}

/** the hero appears where the weapon landed: beside a foe and striking, or at a point */
export function doWarp(target: WarpTarget): void {
  const enemy = target.enemy && target.enemy.hp > 0 ? target.enemy : null;
  if (enemy) {
    warpBeside(enemy, true);
    return;
  }
  const ox = hero.x;
  const oy = hero.y;
  const nx = clamp(hero.sword?.x ?? target.x, 8, W - 8);
  const ny = Math.min((hero.sword?.y ?? target.y) + 18, GROUND);
  arrive(nx, ny, enemy);
  // a ranged hero turns to the foe they threw away from and strikes it from here
  const aim = target.aim && target.aim.hp > 0 ? target.aim : null;
  if (aim) hero.face = Math.sign(aim.x - hero.x) || hero.face;
  // a warp to a point still lands its blow, harder the farther the hero travelled
  strikeOnArrival(warpPower(Math.hypot(nx - ox, ny - oy)), aim);
}
