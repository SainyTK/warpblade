import { ENEMIES } from "../../../constants/enemies";
import { COUNTER } from "../../../constants/hulda/counter";
import { HOLD } from "../../../constants/hulda/grab";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { claim, isClaimed, unclaim } from "./claims";
import { fracture } from "./fracture";
import { hulda } from "./memory";

/** states in which a foe stays in her hands */
const HOLDING = new Set(["hold", "knee", "toss"]);

/** a foe she can take into her hands: a live minion nobody else holds */
export const canHold = (e: Enemy): boolean => e.hp > 0 && ENEMIES[e.type].launchable && !isClaimed(e);

/** seconds a hold lasts: longer with Crushing Grip, Executioner's Grip's own on its big foe */
export function holdTime(): number {
  if (hulda.execute) return COUNTER.hold;
  return skillLevel("h_fracture") ? skillValues("h_fracture").hold : HOLD.time;
}

/** half the width of a foe's body, so a big foe is held at arm's length and a small one close */
function halfWidth(e: Enemy): number {
  const [x0, , x1] = enemyBox(e);
  return (x1 - x0) / 2;
}

/**
 * Put the held foe where her hands are, frozen in place so its own update leaves it there. `ahead` is how far its near
 * side sits from her hands' reach; a negative value swings it behind her.
 */
export function pin(e: Enemy, ahead: number = HOLD.ahead, lift = 0): void {
  const flies = kindOf(e.type).flies;
  const body = Math.max(0, halfWidth(e) - HOLD.grip);
  // the body offset scales with `ahead`, so a foe swung over her head crosses smoothly to the other side
  e.x = hero.x + hero.face * (ahead + clamp(ahead / HOLD.ahead, -1, 1) * body);
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

/** let go of the held foe where it is, stunned this long; Crushing Grip leaves it fractured */
export function drop(stun: number = HOLD.dropStun): void {
  const e = hulda.held;
  hulda.held = null;
  if (!e) return;
  unclaim(e);
  if (e.hp <= 0) return;
  fracture(e);
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
