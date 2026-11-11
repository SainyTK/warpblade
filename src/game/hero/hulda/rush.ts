import { ENEMIES } from "../../../constants/enemies";
import { HOLD } from "../../../constants/hulda/grab";
import { RUSH } from "../../../constants/hulda/rush";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createTrailPiece } from "../../effects/stampedeTrail";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, dust, hitStop, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { skin } from "../skin";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { isClaimed, unclaim } from "./claims";
import { inRecovery } from "./fists";
import { throwPower } from "./fracture";
import { canHold, pin } from "./hold";
import { hulda } from "./memory";
import { rushEnd, stopCharge } from "./rushClock";
import { slamRing } from "./slam";

const HORNS = "h_bullHorns";
const STAMPEDE = "h_stampede";
const GHOST_EVERY = 3 / 30;

/** stamina a rush costs: Stampede's, or the rush's own */
export const rushCost = (): number => (skillLevel(STAMPEDE) ? skillValues(STAMPEDE).cost : RUSH.cost);

/** drop the shoulder and go, the way she is pushed if any */
function startRush(dir: number): void {
  const h = hero;
  if (dir) h.face = dir;
  hulda.landed = false;
  hulda.carried = [];
  hulda.passed = [];
  hulda.rushStop = 0;
  h.running = false;
  h.moveGhost = 0;
  h.st = 0;
  newSwing();
  setState("rush");
  dust(h.x, h.y, 3, -h.face);
  sfx.dodge();
}

/**
 * L on the floor: drop the shoulder and charge the way she is pushed, paid with stamina; also out of a blow that
 * landed. With Stampede at level 6, L in the skid charges again once for free.
 */
export function pressRush(dir: number): boolean {
  const h = hero;
  if (h.state === "rush" && hulda.landed && hulda.rushAgain) {
    hulda.rushAgain = false;
    startRush(dir);
    return true;
  }
  if ((!isFree() && !inRecovery()) || !h.ground || hulda.rushCd > 0) return false;
  if (h.stamina < rushCost()) {
    refuseDash();
    return true;
  }
  h.stamina -= rushCost();
  h.staminaWait = 0.6;
  hulda.rushAgain = skillLevel(STAMPEDE) > 0 && skillValues(STAMPEDE).again > 0;
  startRush(dir);
  return true;
}

/** Bull Horns lifts a minion it meets onto her shoulder while there is room, and from level 6 shoves big foes along */
function lift(e: Enemy): void {
  if (!skillLevel(HORNS) || e.hp <= 0) return;
  const v = skillValues(HORNS);
  if (hulda.carried.length >= v.carry) return;
  const big = !ENEMIES[e.type].launchable;
  if (big ? !v.shove || isClaimed(e) : !canHold(e)) return;
  hulda.carried = [...hulda.carried, e];
}

/** a foe the shoulder meets: a heavy blow that knocks it aside or drags it along, and Bull Horns may lift it */
function meet(e: Enemy): void {
  markStruck(e);
  hulda.passed = [...hulda.passed, e];
  const [cx, cy] = enemyCenter(e);
  const s = skillLevel(STAMPEDE) ? skillValues(STAMPEDE) : null;
  dealDamage(e, progress.stats.ad * (s ? s.shoulder : RUSH.power), {
    fromX: hero.x,
    kx: hero.face * RUSH.kx,
    ky: -40,
    stun: RUSH.stun,
    heavy: true,
    melee: true,
  });
  if (s?.drag) e.x += hero.face * s.drag;
  hero.lastHit = e;
  game.fx.push(createImpact(cx - hero.face * 3, cy, hero.face, true));
  hitStop(0.03);
  shake(0.1, 1.5);
  sfx.hit(true, 0.8);
  lift(e);
}

/** the foes on her shoulder ride with her; big foes she shoves stay on the floor ahead of her shoulder */
function carryAlong(): void {
  hulda.carried.forEach((e, i) => {
    if (ENEMIES[e.type].launchable) {
      pin(e, 4 - (i % 3) * 2, 14 + (i % 3) * 7);
      return;
    }
    pin(e, RUSH.box[2]);
    e.y = hero.y;
  });
}

/**
 * Bull Horns: the foes on her shoulder are slammed down in front of her, and from level 4 the slam rings out, throwing
 * minions up from level 7; Juggernaut's ring is a crater.
 */
function slamCarried(): void {
  const carried = hulda.carried;
  hulda.carried = [];
  if (!carried.length) return;
  const v = skillValues(HORNS);
  const x = hero.x + hero.face * 10;
  for (const e of carried) {
    unclaim(e);
    if (e.hp <= 0) continue;
    const minion = ENEMIES[e.type].launchable;
    e.x = x;
    if (minion && e.y < hero.y - 12) e.y = hero.y;
    dealDamage(e, progress.stats.ad * throwPower(e, v.slam), {
      fromX: hero.x,
      kx: 0,
      stun: RUSH.hornsStun,
      launch: v.launch && minion ? RUSH.hornsLaunch : undefined,
      heavy: true,
    });
    game.fx.push(createImpact(x, hero.y - 6, hero.face, true));
    emitSkillEvent({ type: "throw", foe: e, x, y: hero.y, slam: true });
  }
  if (v.ring > 0) {
    slamRing({
      x,
      floor: hero.y,
      body: null,
      skip: carried,
      radius: v.ring,
      power: v.crater > 0 ? v.crater : v.ringPower,
      stun: RUSH.hornsStun,
      launch: v.launch ? RUSH.hornsLaunch : undefined,
      stop: 0.06,
      shake: v.crater > 0 ? [0.3, 3.5] : [0.18, 2.5],
    });
    return;
  }
  dust(x, hero.y, 6);
  hitStop(0.06);
  shake(0.18, 2.5);
  sfx.boom();
}

/** let go of the foes on her shoulder, when the rush ends some other way */
export function dropCarried(): void {
  const carried = hulda.carried;
  hulda.carried = [];
  for (const e of carried) {
    unclaim(e);
    if (ENEMIES[e.type].launchable) e.y = Math.max(e.y, hero.y - 12);
    e.stun = Math.max(e.stun, HOLD.dropStun);
  }
}

/** Stampede lays a piece of cracked trail behind her each stride of the charge */
function layTrail(): void {
  if (!skillLevel(STAMPEDE)) return;
  const v = skillValues(STAMPEDE);
  game.fx.push(
    createTrailPiece(
      {
        x: hero.x - hero.face * 4,
        y: hero.y,
        w: RUSH.speed * progress.stats.move * GHOST_EVERY,
        damage: progress.stats.ad * v.trail,
        twice: v.twice > 0,
        launch: v.launch > 0,
        stay: v.stay,
      },
      skin.ramp,
    ),
  );
}

/** a foe her shoulder ran into stays on the floor beside her, not on her shoulder */
const ranInto = (): boolean => hulda.passed.some((e) => !hulda.carried.includes(e));

/** a live foe her shoulder has not met yet stands within `RUSH.ahead` of it, at the shoulder's height */
function foeAhead(): boolean {
  const [, y0, x1, y1] = RUSH.box;
  const zone = boxAhead(x1, y0, x1 + RUSH.ahead, y1);
  return game.enemies.some(
    (e) => e.hp > 0 && !struckThisSwing(e) && !hulda.carried.includes(e) && boxHit(zone, enemyBox(e)),
  );
}

/**
 * The load digs in, the charge runs through foes at one speed, then she skids to a stop facing the way she charged.
 * Once she has run into a foe and none waits ahead, the charge stops at its next stride, so the skid leaves her just
 * past the foe.
 */
export function runRush(dt: number): void {
  const h = hero;
  const end = rushEnd();
  if (h.st < RUSH.load) {
    h.vx = -h.face * 30;
    return;
  }
  if (h.st < end) {
    h.vx = h.face * RUSH.speed * progress.stats.move;
    h.moveGhost -= dt;
    if (h.moveGhost <= 0) {
      // a shoulder trail of afterimages and a puff from the back foot every three frames
      h.moveGhost = GHOST_EVERY;
      dropMoveGhost();
      dust(h.x - h.face * 5, h.y, 1, -h.face);
      layTrail();
    }
    carryAlong();
    const [x0, y0, x1, y1] = RUSH.box;
    const box = boxAhead(x0, y0, x1, y1);
    for (const e of game.enemies) {
      if (e.hp <= 0 || hulda.carried.includes(e) || struckThisSwing(e) || !boxHit(box, enemyBox(e))) continue;
      meet(e);
    }
    if (ranInto() && !foeAhead()) stopCharge(h.st);
    return;
  }
  if (!hulda.landed) {
    hulda.landed = true;
    hulda.rushCd = RUSH.cooldown;
    slamCarried();
    dust(h.x, h.y, 4, h.face);
    travelEnded();
    emitSkillEvent({ type: "dash", dir: h.face, foes: hulda.passed });
  }
  if (h.st < end + RUSH.recover) return;
  settle();
}
