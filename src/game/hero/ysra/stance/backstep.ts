import { HERO_MOVE, STAMINA } from "../../../../constants/combat";
import { BACKSTEP, BACKSTEP_SPEED, BACKSTEP_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { riseSpeed } from "../../../../utils/math";
import { isHeld } from "../../../input";
import { hero } from "../../../state";
import { dust } from "../../../world";
import { setState, settle } from "../../actions";
import { refuseDash } from "../../stamina";
import { travelEnded } from "../../travelEnd";
import { stance } from "./memory";
import { startVault } from "./vault";

/** nothing touches her in the first moment of the hop */
export const backstepGuarded = (): boolean => hero.state === "backstep" && hero.st < BACKSTEP.guard;

/** where she faced before a turn the held side made a moment ago, otherwise where she faces */
const settledFace = (): number => (stance.turned < BACKSTEP.turnGrace ? stance.faceBefore : hero.face);

/** her turns, so a side held a moment before the guard still reads as held away */
export function watchFacing(dt: number): void {
  stance.turned += dt;
  if (hero.face === stance.face) return;
  stance.faceBefore = stance.face;
  stance.face = hero.face;
  stance.turned = 0;
}

/** a low hop back, still facing the foe, paid with stamina */
function startBackstep(): void {
  const h = hero;
  if (h.stamina < BACKSTEP.cost) {
    refuseDash();
    return;
  }
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
}

/** while she guards on the floor: a side held away from where she faces hops her back out of the guard; false leaves
 *  the guard to the shared code */
export function backstepFromGuard(): boolean {
  const h = hero;
  if (h.state !== "guard" || !h.ground) return false;
  const face = settledFace();
  const away = isHeld(face > 0 ? "left" : "right") && !isHeld(face > 0 ? "right" : "left");
  if (!away || h.stamina < BACKSTEP.cost) return false;
  h.face = face;
  startBackstep();
  return true;
}

/** the hop carries her back at one speed; on landing she skids to a stop on the floor's own friction, or vaults when I
 *  was pressed on the vault in the hop */
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
  startVault(false);
}
