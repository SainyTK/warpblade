import { BLINK_COST, COST, WARP } from "../../constants/combat";
import { PHANTOM_RAMP } from "../../constants/combo";
import { PAL, SPARKS } from "../../constants/palette";
import { ANCHORS, GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import type { WarpTarget } from "../../types/hero";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createEcho } from "../effects/echo";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { createSlash } from "../effects/slash";
import { createThrownSword } from "../effects/thrownSword";
import { enemyBox, enemyCenter, walks } from "../enemies/enemy";
import { isHeld } from "../input";
import { meleeHit } from "../meleeHit";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { emitSkillEvent } from "../skills/events";
import { skillEvolved, skillValues, withCharms } from "../skills/query";
import { game, hero, ponytail, progress, scarf } from "../state";
import { foesOnSegment } from "../ultimates/segmentHits";
import { boxAhead, boxBehind, newSwing, surfaceBelow } from "../world";
import { leaveHang, setState } from "./actions";
import { leaveAfterimages } from "./afterimages";
import { kael } from "./kael/state";
import { THRUST_SLASH } from "./moves/slashes";
import { showPhantom } from "./phantom";
import { travelEnded } from "./travelEnd";

const WARP_SLASH = { cx: 2, cy: -20, R: 24, sy: 0.5, rot: -0.5, a0: -2.6, a1: 0.8, W: 10, hold: 0.06, trail: 0.24 };
const SKILL = "k_warpcraft";
/** Warpcraft's thrust: the arrival drives the foe this hard and bounces it off a wall */
const THRUST_KICK = 380;
/** Rift Walker: seconds between chained arrivals */
const CHAIN_GAP = 0.14;
/** Blink Step's afterimage cuts foes this close to where Kael stood */
const AFTER_REACH = 26;

export const warpCost = (): number => skillValues(SKILL).cost ?? COST.warp;
export const warpCooldown = (): number => skillValues(SKILL).recharge ?? WARP.cooldown;
const maxCharges = (): number => skillValues(SKILL).charges ?? 1;
/** a warp is ready to throw */
export const warpReady = (): boolean => kael.warpCharges > 0;
/** share of the warp's recharge still to run, 0 while a charge is ready */
export const warpRecharge = (): number => (warpReady() ? 0 : hero.warpCd / warpCooldown());

/** Rift Walker's chain: the foes still to warp to, and seconds to the next. Holds foes, so only the host keeps it */
const chain: { foes: Enemy[]; next: number } = { foes: [], next: 0 };
rememberPerSeat(objectMemory(chain, true));

/** spend a warp charge; the recharge starts if it was not already running */
function spendCharge(): void {
  kael.warpCharges--;
  if (hero.warpCd <= 0) hero.warpCd = warpCooldown();
}

/** a charge comes back each time the recharge runs out, until all are back; and Rift Walker's chain goes on */
export function tickWarp(dt: number): void {
  const max = maxCharges();
  if (kael.warpCharges > max) kael.warpCharges = max;
  if (kael.warpCharges < max && hero.warpCd <= 0) {
    kael.warpCharges++;
    if (kael.warpCharges < max) hero.warpCd = warpCooldown();
  }
  if (!chain.foes.length) return;
  chain.next -= dt;
  if (chain.next > 0) return;
  chain.next = CHAIN_GAP;
  const foe = chain.foes.shift();
  if (foe && foe.hp > 0) warpBeside(foe, false);
}

/** with Crystal Hang, holding up aims at a crystal; otherwise the nearest foe in front, otherwise a point ahead */
export function findWarpTarget(): WarpTarget {
  const chest = hero.y - 20;
  if (isHeld("up")) {
    let best: WarpTarget | null = null;
    let bestD: number = WARP.anchorReach;
    for (const a of ANCHORS) {
      const d = Math.hypot(a.x - hero.x, a.y - chest);
      if (d < bestD && hero.anchor !== a) {
        bestD = d;
        best = { anchor: a, x: a.x, y: a.y };
      }
    }
    if (best) return best;
  }
  let target: WarpTarget | null = null;
  let bestD: number = WARP.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if ((ex - hero.x) * hero.face < -4) continue;
    const d = Math.hypot(ex - hero.x, ey - chest);
    if (d < bestD) {
      bestD = d;
      target = { enemy: e, x: ex, y: ey };
    }
  }
  return target ?? { x: clamp(hero.x + hero.face * WARP.fallback, 12, W - 12), y: hero.y - 18 };
}

export function startThrow(): void {
  hero.mp -= warpCost();
  spendCharge();
  if (hero.state === "hang") leaveHang();
  const target = findWarpTarget();
  if (Math.abs(target.x - hero.x) > 2) hero.face = Math.sign(target.x - hero.x);
  hero.warpTarget = target;
  setState("throw");
  sfx.swing(0.8);
}
export function releaseSword(): void {
  if (!hero.warpTarget) return;
  hero.hasSword = false;
  const path = skillValues(SKILL).path;
  const struck = new Set<Enemy>();
  const power = progress.stats.ad * (path ?? 0);
  hero.sword = createThrownSword(hero.x + hero.face * 13, hero.y - 22, hero.warpTarget, (ax, ay, bx, by) => {
    if (!path) return;
    for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
      struck.add(e);
      dealDamage(e, power, { fromX: ax, kx: Math.sign(bx - ax) * 40, ky: -30 });
      game.fx.push(createImpact(...enemyCenter(e), Math.sign(bx - ax) || 1, false, SPARKS.crystal));
    }
  });
  setState("throwWait");
}

/** Kael appears at (nx, ny); `told` lets the skills hear of it, which a chained arrival does not */
function arrive(nx: number, ny: number, foe: Enemy | null, told = true): void {
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

/** the blow Kael lands as he arrives: with Warpcraft a thrust that drives the foe off, and later cuts behind him too */
function strikeOnArrival(power: number, sureCrit = false): void {
  const v = skillValues(SKILL);
  setState("warpStrike");
  hero.inv = Math.max(hero.inv, 0.3);
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, WARP_SLASH));
  if (v.thrust) game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...THRUST_SLASH, R: 26, W: 7 }));
  const boxes = v.behind ? [boxAhead(-6, -40, 30, 2), boxBehind(-6, -40, 30, 2)] : [boxAhead(-6, -40, 30, 2)];
  meleeHit(boxes, { power, kx: v.thrust ? THRUST_KICK : 160, ky: -80, big: true, wall: !!v.thrust, sureCrit });
}

/** the warp strike's power: Warpcraft's or the base, and more the farther Kael travelled */
function warpPower(distance: number): number {
  const v = skillValues(SKILL);
  const bonus = Math.min(v.cap ?? WARP.maxDistanceBonus, distance * (v.perPx ?? WARP.powerPerPixel));
  return (v.strike ?? WARP.power) + bonus;
}

/** where Kael stands beside a foe he warps to */
function besideFoe(enemy: Enemy, from: number): [number, number] {
  const [ex, ey] = enemyCenter(enemy);
  hero.face = Math.sign(ex - from) || hero.face;
  return [clamp(ex - hero.face * 13, 8, W - 8), Math.min(walks(enemy) ? enemy.y : ey + 18, GROUND)];
}

/** Kael warps beside a foe and strikes it, harder the farther he came */
function warpBeside(enemy: Enemy, told: boolean): void {
  const ox = hero.x;
  const oy = hero.y;
  const [nx, ny] = besideFoe(enemy, ox);
  arrive(nx, ny, enemy, told);
  strikeOnArrival(warpPower(Math.hypot(nx - ox, ny - oy)));
}

/** Rift Walker: after an arrival the sword leaps on to more foes in reach, Kael after it */
function startChain(first: Enemy): void {
  const v = skillValues(SKILL);
  if (!skillEvolved(SKILL) || kael.chainCd > 0) return;
  kael.chainCd = withCharms("cooldown", v.chainEvery);
  chain.foes = game.enemies
    .filter((e) => e !== first && e.hp > 0 && Math.abs(e.x - hero.x) < WARP.reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, v.chain);
  chain.next = CHAIN_GAP;
}

/** Kael appears where his sword landed: beside a foe and striking, hanging from a crystal, or in the air */
export function doWarp(target: WarpTarget): void {
  const enemy = target.enemy && target.enemy.hp > 0 ? target.enemy : null;
  if (enemy) {
    warpBeside(enemy, true);
    startChain(enemy);
    return;
  }
  const ox = hero.x;
  const oy = hero.y;
  let nx: number;
  let ny: number;
  if (target.anchor) {
    nx = target.anchor.x - hero.face * 2;
    ny = target.anchor.y + 38;
  } else {
    nx = hero.sword?.x ?? target.x;
    ny = (hero.sword?.y ?? target.y) + 18;
  }
  nx = clamp(nx, 8, W - 8);
  ny = Math.min(ny, GROUND);
  arrive(nx, ny, enemy);
  if (target.anchor) {
    hero.anchor = target.anchor;
    hero.ground = false;
    setState("hang");
    game.fx.push(createFloorRing(target.anchor.x, target.anchor.y + 2, 18, PAL.crystal, 0.35, 0.35));
    return;
  }
  // a warp to a point in the air or on the floor still lands its blow, harder the farther Kael travelled
  strikeOnArrival(warpPower(Math.hypot(nx - ox, ny - oy)));
}

/** the foe a blink lands behind: the last one hit, or the nearest in reach */
function blinkTarget(): Enemy | null {
  if (hero.lastHit && hero.lastHit.hp > 0) return hero.lastHit;
  return (
    game.enemies
      .filter((e) => e.hp > 0 && Math.abs(e.x - hero.x) < 90)
      .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0] ?? null
  );
}

/** Blink Step: no sword throw, Kael steps through to the foe's back and strikes; the foe cannot turn for a moment, an
 *  afterimage cuts where he stood, and as Shadow Step a phantom strikes from the near side with him */
export function blink(keen: boolean): boolean {
  const v = skillValues("k_blink");
  const e = blinkTarget();
  if (!e) return false;
  hero.mp -= warpCost() * BLINK_COST;
  if (v.recharge) kael.blinkCd = withCharms("cooldown", v.recharge);
  else spendCharge();
  const box = enemyBox(e);
  const side = Math.sign(e.x - hero.x) || hero.face;
  const nx = clamp(side > 0 ? box[2] + 9 : box[0] - 9, 8, W - 8);
  const ny = walks(e) ? e.y : Math.min(GROUND, e.y + 18);
  if (v.after) afterimageCut(hero.x, hero.y, side, progress.stats.ad * v.after);
  arrive(nx, ny, e);
  hero.face = -side;
  if (v.lock) e.turn = -withCharms("duration", v.lock);
  if (skillEvolved("k_blink")) shadowStrike(e, side, progress.stats.ad * v.power);
  strikeOnArrival(v.power, keen && !!v.keen);
  if (e.hp <= 0 && skillEvolved("k_blink")) {
    kael.blinkCd = 0;
    hero.mp += warpCost() * BLINK_COST;
  }
  return true;
}

/** Blink Step's afterimage: where Kael stood, a cut at the foes beside it */
function afterimageCut(x: number, y: number, face: number, damage: number): void {
  game.fx.push(createSlash(x, y, face, { ...WARP_SLASH, ramp: PHANTOM_RAMP }));
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(enemyCenter(e)[0] - x) > AFTER_REACH || Math.abs(e.y - y) > 40) continue;
    dealDamage(e, damage, { fromX: x, kx: face * 40, ky: -30, melee: true });
  }
}

/** Shadow Step: a phantom of Kael on the near side cuts the foe as he strikes from its back */
function shadowStrike(e: Enemy, side: number, damage: number): void {
  const box = enemyBox(e);
  const x = clamp(side > 0 ? box[0] - 9 : box[2] + 9, 8, W - 8);
  showPhantom(x, walks(e) ? e.y : Math.min(GROUND, e.y + 18), side, 0.35);
  game.fx.push(createEcho(e, damage, side, "k_blink"));
}
