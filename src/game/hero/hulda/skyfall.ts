import { ENEMIES } from "../../../constants/enemies";
import { AFTERSHOCK_SUPLEX, GRAB, SKYFALL } from "../../../constants/hulda/grab";
import { GRIT } from "../../../constants/hulda/grit";
import { COMET, DIVE_BOX, RIDE, SKY_BOUNCE } from "../../../constants/hulda/ride";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { skillEvolved, skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, dust, hitStop, shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { travelEnded } from "../travelEnd";
import { claim, isClaimed, unclaim } from "./claims";
import { gainFury } from "./fury";
import { nearestIn } from "./grab";
import { gainGrit } from "./grit";
import { canHold, pin, take } from "./hold";
import { hulda } from "./memory";
import { slamRing } from "./slam";

const ID = "h_skyfall";

/** the clip holds this key while she is still in the air */
export const SKYFALL_AIR = SKYFALL.lunge;

/** K in the air: a lunge down and ahead with both hands out, once per airtime */
export function pressSkyfall(): boolean {
  const h = hero;
  if (!isFree() || h.ground || hulda.airGrabbed) return false;
  hulda.airGrabbed = true;
  hulda.landed = false;
  hulda.struck = false;
  hulda.comet = false;
  hulda.dove = [];
  h.vy = Math.max(h.vy, 40);
  setState("skyfall");
  sfx.swing(0.7);
  return true;
}

/** Comet Grab: K on the floor with nothing in reach leaps her up into a Skyfall; false when it does not apply */
export function cometLeap(): boolean {
  const h = hero;
  if (!skillEvolved(ID) || !isFree() || !h.ground || nearestIn(GRAB.box, () => true)) return false;
  hulda.airGrabbed = true;
  hulda.landed = false;
  hulda.struck = false;
  hulda.comet = true;
  hulda.dove = [];
  h.vy = COMET.rise;
  h.vx = h.face * COMET.ahead;
  h.ground = false;
  setState("skyfall");
  sfx.swing(0.6);
  return true;
}

/** a big foe Skyfall Breaker can ride, from level 3 */
const rideable = (e: Enemy): boolean => skillValues(ID).ride === 1 && !ENEMIES[e.type].launchable && !isClaimed(e);

/** a catch: Fury and a plate as the skill's level gives */
function caught(): void {
  const v = skillValues(ID);
  gainFury(v.fury ?? 0);
  if (v.plate) gainGrit(GRIT.plate);
  sfx.tone(160, 110, 0.08, "square", 0.06);
}

/** the hands meet a big foe: she lands on its back to pound it */
function mount(e: Enemy): void {
  hulda.ridden = e;
  hulda.pounds = skillValues(ID).pounds;
  hulda.struck = true;
  claim(e);
  caught();
  setState("ride");
}

/** foes her dive passes through are dragged down with her into the slam */
function drag(): void {
  const [x0, y0, x1, y1] = DIVE_BOX;
  const box = boxAhead(x0, y0, x1, y1);
  for (const e of game.enemies) {
    if (e === hulda.held || e.hp <= 0 || hulda.dove.includes(e) || !canHold(e) || !boxHit(box, enemyBox(e))) continue;
    hulda.dove = [...hulda.dove, e];
  }
  hulda.dove.forEach((e, i) => {
    pin(e, 2 - (i % 3) * 6, 2 + Math.floor(i / 3) * 4);
  });
}

/** with the bounce, a catch springs her back up for one more Skyfall this airtime */
function bounce(): boolean {
  if (!skillValues(ID).again || hulda.bounced) return false;
  hulda.bounced = true;
  hulda.airGrabbed = false;
  hero.vy = SKY_BOUNCE;
  hero.ground = false;
  setState("fall");
  return true;
}

/** she drives the caught foe into the floor: a heavy slam and a ring that stuns every foe near it */
function slam(): void {
  const h = hero;
  const e = hulda.held;
  const v = skillValues(ID);
  hulda.held = null;
  const dove = hulda.dove;
  hulda.dove = [];
  if (!e) return;
  unclaim(e);
  dove.forEach((d, i) => {
    unclaim(d);
    d.x = h.x + h.face * (4 + i * 3);
    d.y = kindOf(d.type).flies ? h.y - 8 : h.y;
  });
  if (e.hp <= 0) return;
  e.x = h.x + h.face * 8;
  e.y = kindOf(e.type).flies ? h.y - 8 : h.y;
  e.vx = 0;
  e.vy = 0;
  dealDamage(e, progress.stats.ad * (v.slam ?? SKYFALL.power), { fromX: h.x, kx: 0, stun: 1, heavy: true });
  h.lastHit = e;
  gainGrit(GRIT.throw);
  game.fx.push(createImpact(e.x, h.y - 6, h.face, true));
  const aftershock = skillValues("h_wreckingThrow").aftershock === 1;
  slamRing({
    x: e.x,
    floor: h.y,
    body: e,
    radius: (v.ring ?? SKYFALL.ring) * (aftershock ? AFTERSHOCK_SUPLEX.ring : 1),
    power: v.ringPower ?? SKYFALL.ringPower,
    stun: SKYFALL.ringStun,
    launch: aftershock ? AFTERSHOCK_SUPLEX.launch : undefined,
    stop: SKYFALL.stop,
    shake: SKYFALL.shake,
  });
  emitSkillEvent({ type: "throw", foe: e, x: e.x, y: h.y, slam: true });
}

/** the hands reach this box: further with Skyfall Breaker, up over her for a Comet Grab */
function reach(): readonly [number, number, number, number] {
  if (hulda.comet) return COMET.box;
  const [x0, y0, x1, y1] = SKYFALL.box;
  return [x0, y0, x1 * (skillValues(ID).lunge ?? 1), y1];
}

/** the lunge catches a foe for a few frames; caught, she rides it down fast; either way the landing settles her */
export function runSkyfall(): void {
  const h = hero;
  if (hulda.landed) {
    if (h.st >= SKYFALL_AIR + (hulda.struck ? SKYFALL.slamRecover : SKYFALL.recover)) settle();
    return;
  }
  const open = h.st < SKYFALL.lunge || (hulda.comet && h.vy < 0);
  if (!hulda.held && !hulda.struck && open) {
    if (!hulda.comet) h.vx = h.face * 70;
    const prey = nearestIn(reach(), (e) => canHold(e) || rideable(e));
    if (prey && !ENEMIES[prey.type].launchable) return mount(prey);
    if (prey) {
      take(prey);
      hulda.struck = true;
      caught();
    }
  }
  if (hulda.held) {
    h.vx = h.face * 30;
    h.vy = SKYFALL.ride;
    pin(hulda.held, 8, -2);
    if (skillValues(ID).drag) drag();
  }
  if (!h.ground) {
    h.st = Math.min(h.st, SKYFALL_AIR);
    return;
  }
  hulda.landed = true;
  hulda.comet = false;
  h.st = SKYFALL_AIR;
  h.vx = 0;
  dust(h.x, h.y, 5);
  const slammed = !!hulda.held;
  if (slammed) slam();
  else sfx.tone(120, 80, 0.06, "square", 0.05);
  travelEnded();
  if (slammed) bounce();
}

/** she kneels on the big foe's back and pounds it, then leaps off backward */
export function runRide(dt: number): void {
  const h = hero;
  const e = hulda.ridden;
  const v = skillValues(ID);
  if (e && e.hp > 0) {
    h.x = e.x;
    h.y = enemyBox(e)[1] + RIDE.sink;
    h.vx = 0;
    h.vy = 0;
    e.stun = Math.max(e.stun, 0.1);
    claim(e);
    const beat = h.st - RIDE.first - RIDE.strike;
    const done = v.pounds - hulda.pounds;
    if (hulda.pounds > 0 && beat >= done * RIDE.every && beat - dt < done * RIDE.every + 1e-6) pound(e);
    if (hulda.pounds > 0 || beat < (v.pounds - 1) * RIDE.every + RIDE.strike) return;
  }
  leapOff();
}

/** one pound of both fists into the foe's back */
function pound(e: Enemy): void {
  hulda.pounds--;
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, progress.stats.ad * skillValues(ID).poundPower, { fromX: hero.x, kx: 0, heavy: true, melee: true });
  hero.lastHit = e;
  game.fx.push(createImpact(cx, cy - 4, hero.face, true));
  hitStop(RIDE.stop);
  shake(0.15, 2);
  sfx.hit(true, 0.6);
}

/** off its back, backward through the air; the bounce gives one more Skyfall */
function leapOff(): void {
  const e = hulda.ridden;
  hulda.ridden = null;
  if (e) unclaim(e);
  hero.vy = RIDE.leapVy;
  hero.vx = -hero.face * RIDE.leapVx;
  hero.ground = false;
  travelEnded();
  setState("fall");
  if (skillValues(ID).again && !hulda.bounced) {
    hulda.bounced = true;
    hulda.airGrabbed = false;
  }
}

/** she rides a big foe's back */
export const ridesFoe = (): boolean => hero.state === "ride";

/** the lunge and the ride steer her own speed */
export const skyfallDrives = (): boolean => hero.state === "skyfall" && !hulda.landed;
