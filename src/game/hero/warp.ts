import { COST, WARP } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { ANCHORS, GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import type { WarpTarget } from "../../types/hero";
import { clamp } from "../../utils/math";
import { createFloorRing } from "../effects/floorRing";
import { createSlash } from "../effects/slash";
import { createThrownSword } from "../effects/thrownSword";
import { enemyBox, enemyCenter, walks } from "../enemies/enemy";
import { isHeld } from "../input";
import { meleeHit } from "../meleeHit";
import { hasPerk } from "../progress";
import { game, hero, ponytail, scarf } from "../state";
import { boxAhead, surfaceBelow } from "../world";
import { leaveHang, setState } from "./actions";
import { leaveAfterimages } from "./afterimages";
import { warpShock } from "./warpShock";

const WARP_SLASH = { cx: 2, cy: -20, R: 24, sy: 0.5, rot: -0.5, a0: -2.6, a1: 0.8, W: 10, hold: 0.06, trail: 0.24 };
const BLINK_POWER = 1.8;

export const warpCost = (): number => COST.warp * (hasPerk("warpcraft") ? 0.6 : 1);
export const warpCooldown = (): number => WARP.cooldown * (hasPerk("warpcraft") ? 0.6 : 1);

/** with Crystal Hang, holding up aims at a crystal; otherwise the nearest foe in front, otherwise a point ahead */
export function findWarpTarget(): WarpTarget {
  const chest = hero.y - 20;
  if (isHeld("up") && hasPerk("hang")) {
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
  hero.warpCd = warpCooldown();
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
  hero.sword = createThrownSword(hero.x + hero.face * 13, hero.y - 22, hero.warpTarget);
  setState("throwWait");
}

function arrive(nx: number, ny: number): void {
  const ox = hero.x;
  const oy = hero.y;
  leaveAfterimages(ox, oy, nx, ny);
  scarf.shift(nx - ox, ny - oy);
  ponytail.shift(nx - ox, ny - oy);
  Object.assign(hero, { x: nx, y: ny, vx: 0, vy: 0, sword: null, hasSword: true });
  hero.ground = Math.abs(ny - surfaceBelow(nx, ny - 1)) < 0.5;
  sfx.warp();
}

function strikeOnArrival(power: number): void {
  setState("warpStrike");
  hero.inv = Math.max(hero.inv, 0.3);
  game.swing++;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, WARP_SLASH));
  meleeHit([boxAhead(-6, -40, 30, 2)], { power, kx: 160, ky: -80, big: true });
  warpShock();
}

/** Kael appears where his sword landed: beside a foe and striking, hanging from a crystal, or in the air */
export function doWarp(target: WarpTarget): void {
  const ox = hero.x;
  const oy = hero.y;
  const enemy = target.enemy && target.enemy.hp > 0 ? target.enemy : null;
  let nx: number;
  let ny: number;
  if (enemy) {
    const [ex, ey] = enemyCenter(enemy);
    hero.face = Math.sign(ex - ox) || hero.face;
    nx = ex - hero.face * 13;
    ny = walks(enemy) ? enemy.y : ey + 18;
  } else if (target.anchor) {
    nx = target.anchor.x - hero.face * 2;
    ny = target.anchor.y + 38;
  } else {
    nx = hero.sword?.x ?? target.x;
    ny = (hero.sword?.y ?? target.y) + 18;
  }
  nx = clamp(nx, 8, W - 8);
  ny = Math.min(ny, GROUND);
  arrive(nx, ny);
  if (target.anchor) {
    hero.anchor = target.anchor;
    hero.ground = false;
    setState("hang");
    game.fx.push(createFloorRing(target.anchor.x, target.anchor.y + 2, 18, PAL.crystal, 0.35, 0.35));
    return;
  }
  // the farther Kael travelled, the harder the strike
  const distance = Math.hypot(nx - ox, ny - oy);
  strikeOnArrival(WARP.power + Math.min(WARP.maxDistanceBonus, distance * WARP.powerPerPixel));
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

/** J J K with Blink Combo: no sword throw, Kael steps through to the foe's back and strikes */
export function blink(): boolean {
  const e = blinkTarget();
  if (!e) return false;
  hero.mp -= warpCost() / 2;
  hero.warpCd = warpCooldown();
  const box = enemyBox(e);
  const side = Math.sign(e.x - hero.x) || hero.face;
  const nx = clamp(side > 0 ? box[2] + 9 : box[0] - 9, 8, W - 8);
  const ny = walks(e) ? e.y : Math.min(GROUND, e.y + 18);
  arrive(nx, ny);
  hero.face = -side;
  strikeOnArrival(BLINK_POWER);
  return true;
}
