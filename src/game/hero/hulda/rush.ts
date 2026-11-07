import { ENEMIES } from "../../../constants/enemies";
import { HOLD } from "../../../constants/hulda/grab";
import { RUSH } from "../../../constants/hulda/rush";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, dust, hitStop, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { unclaim } from "./claims";
import { inRecovery } from "./fists";
import { canHold, pin } from "./hold";
import { hulda } from "./memory";

const runEnd = RUSH.load + RUSH.time;
const HORNS = "h_bullHorns";
const GHOST_EVERY = 3 / 30;

/** L on the floor: drop the shoulder and charge, paid with stamina; also out of a blow that landed */
export function pressRush(): boolean {
  const h = hero;
  if ((!isFree() && !inRecovery()) || !h.ground || hulda.rushCd > 0) return false;
  if (h.stamina < RUSH.cost) {
    refuseDash();
    return true;
  }
  h.stamina -= RUSH.cost;
  h.staminaWait = 0.6;
  hulda.landed = false;
  hulda.carried = [];
  hulda.passed = [];
  h.running = false;
  h.moveGhost = 0;
  newSwing();
  setState("rush");
  dust(h.x, h.y, 3, -h.face);
  sfx.dodge();
  return true;
}

/** Bull Horns lifts a foe it meets onto her shoulder while there is room */
function lift(e: Enemy): void {
  if (!skillLevel(HORNS) || hulda.carried.length >= skillValues(HORNS).carry || !canHold(e) || e.hp <= 0) return;
  hulda.carried = [...hulda.carried, e];
}

/** a foe the shoulder meets: a heavy blow that knocks it aside, and Bull Horns may lift it */
function meet(e: Enemy): void {
  markStruck(e);
  hulda.passed = [...hulda.passed, e];
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * RUSH.power, {
    fromX: hero.x,
    kx: hero.face * RUSH.kx,
    ky: -40,
    stun: RUSH.stun,
    heavy: true,
    melee: true,
  });
  hero.lastHit = e;
  game.fx.push(createImpact(cx - hero.face * 3, cy, hero.face, true));
  hitStop(0.03);
  shake(0.1, 1.5);
  sfx.hit(true, 0.8);
  lift(e);
}

/** Bull Horns: the foes on her shoulder are slammed down in front of her */
function slamCarried(): void {
  const carried = hulda.carried;
  hulda.carried = [];
  if (!carried.length) return;
  const v = skillValues(HORNS);
  for (const e of carried) {
    unclaim(e);
    if (e.hp <= 0) continue;
    e.x = hero.x + hero.face * 10;
    e.y = ENEMIES[e.type].launchable && e.y < hero.y - 12 ? hero.y : e.y;
    dealDamage(e, progress.stats.ad * v.slam, { fromX: hero.x, kx: 0, stun: RUSH.hornsStun, heavy: true });
    game.fx.push(createImpact(e.x, hero.y - 6, hero.face, true));
  }
  dust(hero.x + hero.face * 10, hero.y, 6);
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
    e.stun = Math.max(e.stun, HOLD.dropStun);
  }
}

/** the load digs in, the charge runs through foes at one speed, then she skids to a stop */
export function runRush(dt: number): void {
  const h = hero;
  if (h.st < RUSH.load) {
    h.vx = -h.face * 30;
    return;
  }
  if (h.st < runEnd) {
    h.vx = h.face * RUSH.speed * progress.stats.move;
    h.moveGhost -= dt;
    if (h.moveGhost <= 0) {
      // a shoulder trail of afterimages and a puff from the back foot every three frames
      h.moveGhost = GHOST_EVERY;
      dropMoveGhost();
      dust(h.x - h.face * 5, h.y, 1, -h.face);
    }
    hulda.carried.forEach((e, i) => {
      pin(e, 4 - i * 2, 14 + i * 7);
    });
    const [x0, y0, x1, y1] = RUSH.box;
    const box = boxAhead(x0, y0, x1, y1);
    for (const e of game.enemies) {
      if (e.hp <= 0 || hulda.carried.includes(e) || struckThisSwing(e) || !boxHit(box, enemyBox(e))) continue;
      meet(e);
    }
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
  if (h.st >= runEnd + RUSH.recover) settle();
}

/** the load and the charge drive her own speed; the skid slows under the floor's own friction */
export const rushDrives = (): boolean => hero.state === "rush" && hero.st < runEnd;
