import { ENEMIES } from "../../../constants/enemies";
import { ZIP } from "../../../constants/orrin/hook";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { Point } from "../../../types/world";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { setState } from "../actions";
import { travelEnded } from "../travelEnd";
import { giveArcBack } from "./airArc";
import { gainMomentum } from "./momentum";
import { orrin, orrinHost } from "./memory";

const GAFF = "o_gaff";

/** Harpoon: every foe on the line between him and the hooked one is dragged to it first */
function harpoon(target: Enemy): void {
  const [tx, ty] = enemyCenter(target);
  const [hx, hy] = [hero.x, hero.y - 16];
  const len = Math.hypot(tx - hx, ty - hy) || 1;
  for (const e of game.enemies) {
    if (e === target || e.hp <= 0 || ENEMIES[e.type].weight >= 1) continue;
    const [cx, cy] = enemyCenter(e);
    const u = ((cx - hx) * (tx - hx) + (cy - hy) * (ty - hy)) / (len * len);
    if (u < 0 || u > 1) continue;
    const off = Math.abs((cx - hx) * (ty - hy) - (cy - hy) * (tx - hx)) / len;
    if (off > 14) continue;
    e.x = tx - Math.sign(tx - hx) * 8;
    e.stun = Math.max(e.stun, 0.3);
  }
}

/** the hook bit a foe: the chain hauls him in to it */
export function startZip(foe: Enemy, _at: Point): void {
  orrinHost.zipFoe = foe;
  orrin.latch = "foe";
  orrin.latchAt = null;
  hero.ground = false;
  if (skillValues(GAFF).harpoon) harpoon(foe);
  setState("zip");
  sfx.rattle();
}

/** the flying kick at the end of a zip; Gaff makes it hit harder, crit a foe winding up and ring the foes round it */
function arrive(foe: Enemy): void {
  const v = skillValues(GAFF);
  const winding = foe.state === "wind";
  const crit = !!v.harpoon || (!!v.windup && winding);
  const power = ZIP.power * (v.crit || 1 + (v.power ?? 0));
  const ring = withCharms("area", v.ring ?? 0);
  const [fx, fy] = enemyCenter(foe);
  const targets = ring > 0 ? game.enemies.filter((e) => e === foe || touchesRing(e, fx, fy, ring)) : [foe];
  for (const e of targets) {
    dealDamage(e, progress.stats.ad * power, {
      fromX: hero.x,
      kx: hero.face * ZIP.kx,
      ky: -40,
      heavy: true,
      melee: true,
      sureCrit: crit,
      stun: winding && v.windup ? 1.2 : undefined,
    });
  }
  if (winding && v.windup) foe.stagger = Math.max(foe.stagger, 1.2);
  if (crit && v.momentum) gainMomentum(v.momentum);
  game.fx.push(createImpact(fx, fy, hero.face, true));
  hitStop(0.07);
  shake(0.16, 2.4);
  sfx.hit(true, 0.9);
  if (v.yank && ENEMIES[foe.type].launchable && foe.hp > 0) {
    foe.vx = -hero.face * ZIP.bounceBack;
    foe.vy = -ZIP.bounceUp;
  }
  if (v.hook) orrin.hooks++;
}

function touchesRing(e: Enemy, x: number, y: number, r: number): boolean {
  if (e.hp <= 0) return false;
  const [cx, cy] = enemyCenter(e);
  return Math.hypot(cx - x, cy - y) <= r;
}

/** the haul: straight at the foe at the zip's speed; on arrival the kick, then a bounce up and back, still in the air */
export function runZip(): void {
  const h = hero;
  const foe = orrinHost.zipFoe;
  if (!foe || foe.hp <= 0 || h.st > ZIP.most) return endZip(false);
  const [fx, fy] = enemyCenter(foe);
  const dx = fx - h.x;
  const dy = fy - (h.y - 16);
  const d = Math.hypot(dx, dy);
  if (Math.abs(dx) > 2) h.face = Math.sign(dx);
  if (d < 12) {
    arrive(foe);
    return endZip(true);
  }
  h.vx = (dx / d) * ZIP.speed;
  h.vy = (dy / d) * ZIP.speed;
}

/** the zip is over: bounce off the foe (or just fly on when it is gone) */
function endZip(kicked: boolean): void {
  const h = hero;
  orrinHost.zipFoe = null;
  orrin.latch = null;
  if (kicked) {
    h.vx = -h.face * ZIP.bounceBack;
    h.vy = -ZIP.bounceUp;
  }
  giveArcBack(false);
  orrin.flung = false;
  orrin.sinceRelease = 9;
  setState("fly");
  travelEnded();
}
