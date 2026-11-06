import { ENEMIES } from "../../../constants/enemies";
import { HOLD } from "../../../constants/hulda/grab";
import { RUSH } from "../../../constants/hulda/rush";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, dust, hitStop, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { dropMoveGhost } from "../afterimages";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { unclaim } from "./claims";
import { inRecovery } from "./fists";
import { canHold, pin, take } from "./hold";
import { hulda } from "./memory";

const runEnd = RUSH.load + RUSH.time;
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
  hulda.carried = null;
  h.running = false;
  h.moveGhost = 0;
  newSwing();
  setState("rush");
  dust(h.x, h.y, 3, -h.face);
  sfx.dodge();
  return true;
}

/** a foe the shoulder meets: Rush Grab takes a minion into her hands, Bull Horns lifts the first onto her shoulder */
function meet(e: Enemy): boolean {
  markStruck(e);
  if (hasPerk("rushGrab") && canHold(e)) {
    take(e);
    hulda.landed = true;
    setState("hold");
    travelEnded();
    sfx.tone(160, 110, 0.08, "square", 0.06);
    return true;
  }
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
  if (hasPerk("bullHorns") && !hulda.carried && canHold(e) && e.hp > 0) hulda.carried = e;
  return false;
}

/** Bull Horns: the foe on her shoulder is slammed down in front of her */
function slamCarried(): void {
  const e = hulda.carried;
  hulda.carried = null;
  if (!e) return;
  unclaim(e);
  if (e.hp <= 0) return;
  e.x = hero.x + hero.face * 10;
  e.y = ENEMIES[e.type].launchable && e.y < hero.y - 12 ? hero.y : e.y;
  dealDamage(e, progress.stats.ad * RUSH.hornsPower, { fromX: hero.x, kx: 0, stun: RUSH.hornsStun, heavy: true });
  game.fx.push(createImpact(e.x, hero.y - 6, hero.face, true));
  dust(e.x, hero.y, 6);
  hitStop(0.06);
  shake(0.18, 2.5);
  sfx.boom();
}

/** let go of a foe on her shoulder, when the rush ends some other way */
export function dropCarried(): void {
  const e = hulda.carried;
  hulda.carried = null;
  if (!e) return;
  unclaim(e);
  e.stun = Math.max(e.stun, HOLD.dropStun);
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
    if (hulda.carried) pin(hulda.carried, 4, 14);
    const [x0, y0, x1, y1] = RUSH.box;
    const box = boxAhead(x0, y0, x1, y1);
    for (const e of game.enemies) {
      if (e.hp <= 0 || e === hulda.carried || struckThisSwing(e) || !boxHit(box, enemyBox(e))) continue;
      if (meet(e)) return;
    }
    return;
  }
  if (!hulda.landed) {
    hulda.landed = true;
    hulda.rushCd = RUSH.cooldown;
    slamCarried();
    dust(h.x, h.y, 4, h.face);
    travelEnded();
  }
  if (h.st >= runEnd + RUSH.recover) settle();
}

/** the load and the charge drive her own speed; the skid slows under the floor's own friction */
export const rushDrives = (): boolean => hero.state === "rush" && hero.st < runEnd;
