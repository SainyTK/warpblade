import { ENEMIES } from "../../../constants/enemies";
import { HOLD } from "../../../constants/hulda/grab";
import type { Enemy } from "../../../types/enemy";
import { kindOf } from "../../enemies/kinds";
import { hasPerk } from "../../progress";
import { hero } from "../../state";
import { claim, isClaimed, unclaim } from "./claims";
import { hulda } from "./memory";

/** states in which a foe stays in her hands */
const HOLDING = new Set(["hold", "knee", "toss"]);

/** a foe she can take into her hands: a live minion nobody else holds */
export const canHold = (e: Enemy): boolean => e.hp > 0 && ENEMIES[e.type].launchable && !isClaimed(e);

/** seconds a hold lasts, longer with Iron Grip */
export const holdTime = (): number => (hasPerk("ironGrip") ? HOLD.gripTime : HOLD.time);

/** put the held foe where her hands are, frozen in place so its own update leaves it there */
export function pin(e: Enemy, ahead: number = HOLD.ahead, lift = 0): void {
  const flies = kindOf(e.type).flies;
  e.x = hero.x + hero.face * ahead;
  e.y = hero.y + (flies ? HOLD.flierY : HOLD.walkerY) - lift;
  e.vx = 0;
  e.vy = 0;
  e.air = false;
  e.stun = Math.max(e.stun, HOLD.stun);
  claim(e);
}

/** take a foe into her hands */
export function take(e: Enemy): void {
  hulda.held = e;
  hulda.holdT = 0;
  hulda.knees = 0;
  pin(e);
}

/** let go of the held foe where it is, stunned this long */
export function drop(stun: number = HOLD.dropStun): void {
  const e = hulda.held;
  hulda.held = null;
  if (!e) return;
  unclaim(e);
  if (e.hp <= 0) return;
  e.stun = Math.max(e.stun, stun);
  // a walker held up at her hands drops back onto the floor
  if (!kindOf(e.type).flies) e.y = hero.y;
}

/** the held foe died, or she lost her grip by leaving the hold for a state that does not keep it: she lets go */
export function watchGrip(): void {
  const e = hulda.held;
  if (!e) return;
  if (e.hp <= 0 || hero.hp <= 0) {
    drop();
    return;
  }
  if (!HOLDING.has(hero.state) && hero.state !== "skyfall") drop();
}
