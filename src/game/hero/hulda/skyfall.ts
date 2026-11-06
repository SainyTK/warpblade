import { AFTERSHOCK_SUPLEX, SKYFALL } from "../../../constants/hulda/grab";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { kindOf } from "../../enemies/kinds";
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { dust } from "../../world";
import { isFree, setState, settle } from "../actions";
import { travelEnded } from "../travelEnd";
import { unclaim } from "./claims";
import { nearestIn } from "./grab";
import { gainGrit } from "./grit";
import { canHold, pin, take } from "./hold";
import { hulda } from "./memory";
import { slamRing } from "./slam";

/** the clip holds this key while she is still in the air */
export const SKYFALL_AIR = SKYFALL.lunge;

/** K in the air: a lunge down and ahead with both hands out, once per airtime */
export function pressSkyfall(): boolean {
  const h = hero;
  if (!isFree() || h.ground || hulda.airGrabbed) return false;
  hulda.airGrabbed = true;
  hulda.landed = false;
  hulda.struck = false;
  h.vy = Math.max(h.vy, 40);
  setState("skyfall");
  sfx.swing(0.7);
  return true;
}

/** she drives the caught foe into the floor: a heavy slam and a ring that stuns every foe near it */
function slam(): void {
  const h = hero;
  const e = hulda.held;
  hulda.held = null;
  if (!e) return;
  unclaim(e);
  if (e.hp <= 0) return;
  e.x = h.x + h.face * 8;
  e.y = kindOf(e.type).flies ? h.y - 8 : h.y;
  e.vx = 0;
  e.vy = 0;
  dealDamage(e, progress.stats.ad * SKYFALL.power, { fromX: h.x, kx: 0, stun: 1, heavy: true });
  h.lastHit = e;
  gainGrit(GRIT.throw);
  game.fx.push(createImpact(e.x, h.y - 6, h.face, true));
  const aftershock = hasPerk("aftershockSuplex");
  slamRing({
    x: e.x,
    floor: h.y,
    body: e,
    radius: SKYFALL.ring * (aftershock ? AFTERSHOCK_SUPLEX.ring : 1),
    power: SKYFALL.ringPower,
    stun: SKYFALL.ringStun,
    launch: aftershock ? AFTERSHOCK_SUPLEX.launch : undefined,
    stop: SKYFALL.stop,
    shake: SKYFALL.shake,
  });
}

/** the lunge catches a foe for a few frames; caught, she rides it down fast; either way the landing settles her */
export function runSkyfall(): void {
  const h = hero;
  if (hulda.landed) {
    if (h.st >= SKYFALL_AIR + (hulda.struck ? SKYFALL.slamRecover : SKYFALL.recover)) settle();
    return;
  }
  const e = hulda.held;
  if (!e && !hulda.struck && h.st < SKYFALL.lunge) {
    h.vx = h.face * 70;
    const prey = nearestIn(SKYFALL.box, canHold);
    if (prey) {
      take(prey);
      hulda.struck = true;
      sfx.tone(160, 110, 0.08, "square", 0.06);
    }
  }
  if (hulda.held) {
    h.vx = h.face * 30;
    h.vy = SKYFALL.ride;
    pin(hulda.held, 8, -2);
  }
  if (!h.ground) {
    h.st = Math.min(h.st, SKYFALL_AIR);
    return;
  }
  hulda.landed = true;
  h.st = SKYFALL_AIR;
  h.vx = 0;
  dust(h.x, h.y, 5);
  if (hulda.held) slam();
  else sfx.tone(120, 80, 0.06, "square", 0.05);
  travelEnded();
}

/** the lunge and the ride steer her own speed */
export const skyfallDrives = (): boolean => hero.state === "skyfall" && !hulda.landed;
