import { STAMINA } from "../../../../constants/combat";
import { SPARKS } from "../../../../constants/palette";
import { GUARD, WARPATH } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { isHeld } from "../../../input";
import { emitSkillEvent } from "../../../skills/events";
import { skillEvolved, skillLevel, skillValues } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { boxAhead, boxHit, shake } from "../../../world";
import { isFree } from "../../actions";
import { emitYsra } from "../events";
import { pinFoe } from "../pin";
import { stance } from "./memory";

/** Warpath's numbers; empty when not held */
const warpath = () => skillValues("y_warpath");

/** she walks toward where she faces with the matching side held */
function walkingOn(): boolean {
  const h = hero;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  return h.ground && h.state === "walk" && dir === h.face;
}

/** Warpath: walking one way long enough breaks into the charge; stopping, turning or any action resets the count */
function buildCharge(dt: number): void {
  if (!skillLevel("y_warpath") || hero.running || !walkingOn()) {
    stance.walked = 0;
    return;
  }
  stance.walked += dt;
  if (stance.walked < warpath().after) return;
  hero.running = true;
  stance.walked = 0;
  sfx.dodge();
}

/** the run key, the stick pushed far or a double tap: with Warpath she charges toward that side at once */
export function chargeNow(dir: number): void {
  if (!skillLevel("y_warpath") || !isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** Juggernaut: a shouldered small foe is taken onto the glaive and carried */
function gather(e: Enemy): boolean {
  if (!skillEvolved("y_warpath") || e.rank !== "minion" || stance.carried.includes(e)) return false;
  stance.carried.push(e);
  return true;
}

/** a small foe in the way is shouldered aside; a big one stops the charge dead, unless Warpath lets her through */
function shoulder(): void {
  const h = hero;
  const v = warpath();
  const box = boxAhead(...WARPATH.box);
  for (const e of game.enemies) {
    if (e.hp <= 0 || stance.shouldered.has(e) || stance.carried.includes(e) || !boxHit(box, enemyBox(e))) continue;
    stance.shouldered.set(e, WARPATH.again);
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(h.x + h.face * 6, ey, h.face, false));
    if (e.rank !== "minion" && !v.elites) {
      h.running = false;
      h.vx = -h.face * 80;
      shake(0.12, 1.6);
      sfx.block();
      return;
    }
    if (gather(e)) continue;
    dealDamage(e, progress.stats.ad * v.shoulder, {
      fromX: h.x,
      kx: Math.sign(ex - h.x || h.face) * WARPATH.kx,
      launch: v.launch ? WARPATH.launch : undefined,
      stagger: WARPATH.stagger,
      stun: v.knock || undefined,
      heavy: true,
      melee: true,
    });
    shake(0.08, 1.2);
    sfx.hit(false, 0.8);
  }
}

/** the carried foes ride the glaive ahead of her */
function carry(): void {
  stance.carried = stance.carried.filter((e) => e.hp > 0);
  stance.carried.forEach((e, i) => {
    e.x = hero.x + hero.face * (WARPATH.carry + i * WARPATH.stack);
    e.vx = 0;
  });
}

/** the charge is over: every carried foe is slammed down off the glaive and pinned */
function slamCarried(): void {
  if (!stance.carried.length) return;
  const v = warpath();
  for (const e of stance.carried) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    dealDamage(e, progress.stats.ad * v.slam, { fromX: hero.x, kx: hero.face * 30, heavy: true, melee: true });
    pinFoe(e, { time: 1.5, taken: 0, burn: 0 });
    game.fx.push(createImpact(ex, ey, hero.face, true));
  }
  stance.carried = [];
  shake(0.3, 3.5);
  sfx.hit(true, 0.6);
  emitYsra("strike", { source: "juggernaut", hits: 1 });
}

/** the charge: built from a steady walk, foes in the way shouldered, her path reported each frame */
export function tickWarpath(dt: number): void {
  for (const [e, left] of stance.shouldered) {
    if (left <= dt) stance.shouldered.delete(e);
    else stance.shouldered.set(e, left - dt);
  }
  buildCharge(dt);
  if (hero.state !== "run") {
    slamCarried();
    return;
  }
  emitYsra("travel", { x: hero.x, y: hero.y, from: "charge" });
  shoulder();
  carry();
}

/** Warpath: a blow from the front while she charges is blocked for stamina, as her guard takes it */
export function chargeTakes(fromX: number): boolean {
  const h = hero;
  if (h.state !== "run" || !warpath().block || (fromX - h.x) * h.face < 0) return false;
  if (h.stamina < GUARD.blockCost) return false;
  h.stamina -= GUARD.blockCost;
  h.staminaWait = STAMINA.delay;
  game.fx.push(createImpact(h.x + h.face * 9, h.y - 19, -h.face, false, SPARKS.hot));
  sfx.block();
  emitYsra("block", { fromX });
  emitSkillEvent({ type: "block", fromX });
  return true;
}
