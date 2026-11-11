import { HERO_MOVE, STAMINA } from "../../../../constants/combat";
import { BACKSTEP, BACKSTEP_SPEED, BACKSTEP_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { riseSpeed } from "../../../../utils/math";
import { hero } from "../../../state";
import { dust } from "../../../world";
import { setState, settle } from "../../actions";
import { refuseDash } from "../../stamina";
import { travelEnded } from "../../travelEnd";
import { cutMove } from "./cut";
import { stance } from "./memory";
import { startVault } from "./vault";

/** nothing touches her in the first moment of the hop */
export const backstepGuarded = (): boolean => hero.state === "backstep" && hero.st < BACKSTEP.guard;

/** L with a side held away from where she faces: a low hop back, still facing the foe, paid with stamina */
export function startBackstep(): boolean {
  const h = hero;
  if (h.stamina < BACKSTEP.cost) {
    refuseDash();
    return true;
  }
  cutMove();
  h.stamina -= BACKSTEP.cost;
  h.staminaWait = STAMINA.delay;
  h.running = false;
  h.vy = -riseSpeed(BACKSTEP.hop, HERO_MOVE.gravity);
  h.ground = false;
  stance.landed = false;
  stance.vaultNext = false;
  setState("backstep");
  dust(h.x, h.y, 3, h.face);
  sfx.dodge();
  return true;
}

/** the hop carries her back at one speed; on landing she skids to a stop on the floor's own friction, or vaults when K
 *  was pressed in the hop */
export function runBackstep(): void {
  const h = hero;
  if (stance.landed) {
    if (h.st >= BACKSTEP_TIMES.end) settle();
    return;
  }
  h.vx = -h.face * BACKSTEP_SPEED;
  if (!h.ground) {
    h.st = Math.min(h.st, BACKSTEP_TIMES.land - 0.001);
    return;
  }
  stance.landed = true;
  h.st = BACKSTEP_TIMES.land;
  dust(h.x, h.y, 4, h.face);
  travelEnded();
  if (!stance.vaultNext) return;
  stance.vaultNext = false;
  startVault();
}
