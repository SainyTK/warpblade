import { COST, WARP } from "../../constants/combat";
import { POSES } from "../../constants/hero";
import { PAL } from "../../constants/palette";
import { ANCHORS, GROUND, W } from "../../constants/stage";
import { SpriteCanvas } from "../../engine/sprite";
import { sfx } from "../../services/audio";
import type { HeroState, WarpTarget } from "../../types/hero";
import { PK } from "../../types/particle";
import { clamp, lerp, TAU } from "../../utils/math";
import { meleeHit } from "../combat";
import { createFloorRing } from "../effects/floorRing";
import { createSlash } from "../effects/slash";
import { createThrownSword } from "../effects/thrownSword";
import { createWarpLine } from "../effects/warpLine";
import { enemyCenter } from "../enemies/enemy";
import { isHeld } from "../input";
import { game, hero, lights, particles, ponytail, rng, scarf } from "../state";
import { boxAhead, surfaceBelow } from "../world";
import { drawHero } from "./drawHero";
import { heroLook } from "./look";

/** afterimages are drawn into their own canvas, then copied */
export const ghostCanvas = new SpriteCanvas(80, 76, 40, 62);

export function setState(s: HeroState): void {
  hero.state = s;
  hero.st = 0;
  hero.hitDone = false;
}
export function leaveHang(): void {
  hero.anchor = null;
  hero.hasSword = true;
  hero.ground = false;
}
export function startAttack(n: 1 | 2 | 3): void {
  hero.combo = n;
  hero.queued = false;
  game.swing++;
  if (hero.state === "hang") leaveHang();
  setState(n === 1 ? "atk1" : n === 2 ? "atk2" : "atk3");
  sfx.swing(n === 3 ? 0.7 : 1);
}

/** holding up aims at a crystal; otherwise the nearest foe in front, otherwise a point ahead */
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
  hero.mp -= COST.warp;
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

function leaveAfterimages(ox: number, oy: number, nx: number, ny: number): void {
  drawHero(ghostCanvas, POSES.warpFly, heroLook(4));
  const snap = ghostCanvas.snapshot();
  for (let i = 0; i < 5; i++) {
    const u = i / 5;
    const life = 0.18 + u * 0.18;
    game.ghosts.push({ s: snap, x: lerp(ox, nx, u), y: lerp(oy, ny, u), flip: hero.face < 0, life, max: life });
  }
  game.fx.push(createWarpLine(ox, oy - 18, nx, ny - 18));
  for (let i = 0; i < 12; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(30, 120);
    particles.spawn(PK.MOTE, ox, oy - 18, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.2, 0.45), {
      col: rng.pick(PAL.crystal.slice(3)),
      size: 0.6,
    });
  }
  lights.add(nx, ny - 18, 44, PAL.crystal[4], 0.9, 0.25);
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
    ny = enemy.type === "wisp" ? ey + 18 : enemy.y;
  } else if (target.anchor) {
    nx = target.anchor.x - hero.face * 2;
    ny = target.anchor.y + 38;
  } else {
    nx = hero.sword?.x ?? target.x;
    ny = (hero.sword?.y ?? target.y) + 18;
  }
  nx = clamp(nx, 8, W - 8);
  ny = Math.min(ny, GROUND);
  leaveAfterimages(ox, oy, nx, ny);
  scarf.shift(nx - ox, ny - oy);
  ponytail.shift(nx - ox, ny - oy);
  Object.assign(hero, { x: nx, y: ny, vx: 0, vy: 0, sword: null, hasSword: true });
  hero.ground = Math.abs(ny - surfaceBelow(nx, ny - 1)) < 0.5;
  sfx.warp();
  if (target.anchor) {
    hero.anchor = target.anchor;
    hero.ground = false;
    setState("hang");
    game.fx.push(createFloorRing(target.anchor.x, target.anchor.y + 2, 18, PAL.crystal, 0.35, 0.35));
    return;
  }
  setState("warpStrike");
  hero.inv = Math.max(hero.inv, 0.3);
  game.swing++;
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      cx: 2,
      cy: -20,
      R: 24,
      sy: 0.5,
      rot: -0.5,
      a0: -2.6,
      a1: 0.8,
      W: 10,
      hold: 0.06,
      trail: 0.24,
    }),
  );
  // the farther he travelled, the harder he hits
  const distance = Math.hypot(nx - ox, ny - oy);
  meleeHit(boxAhead(-6, -40, 30, 2), Math.round(22 + Math.min(28, distance * 0.14)), 160, -80, true);
}
