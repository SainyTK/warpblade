import { GUARD_TIMES, HERO_GUARD, STAMINA } from "../../constants/combat";
import { FLOW } from "../../constants/growth";
import { SPARKS } from "../../constants/palette";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { addFlow } from "../build/flow";
import { cue } from "../cue";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { staggerFoe } from "../enemies/stagger";
import { feat } from "../feat";
import { isHeld } from "../input";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { emitSkillEvent } from "../skills/events";
import { game, hero, lights, progress } from "../state";
import { hitStop, shake } from "../world";
import { setState, settle } from "./actions";
import { kit } from "./kits";
import { cutForSharedAction, maySharedAct } from "./sharedCut";
import { skin } from "./skin";
import { refundStamina, refuseDash } from "./stamina";

/**
 * K: the guard every hero shares. Held, it blocks blows from the front for stamina, and a blow from behind still lands.
 * A blow that meets the guard within `HERO_GUARD.parryWindow` of the press is a parry: it takes nothing, the attacker
 * reels, the world slows a beat, MP and stamina come back, and the hero's own parry reward fires (`GuardStyle.parried`).
 * So holding K is safe and steady, and pressing it just as a blow comes is the play that pays.
 *
 * One touch is one block: after a block the same foe's blows stop on the guard for nothing for `HERO_GUARD.blockGap`,
 * so a foe pressed against the hero cannot drain the bar in a moment. A guard that breaks stays down until K is pressed
 * again. A blow that could not have hurt the hero anyway (the moments after a hit, a dodge) costs the guard nothing.
 */

/** a foe the guard has just blocked, and the seconds left before its next blow counts as a new one */
interface Blocked {
  foe: Enemy;
  left: number;
}

/**
 * Seconds the guard has been up, seconds left in which nothing touches the hero after a parry, whether the guard broke
 * and waits for a fresh press, and the foes it has just blocked.
 */
const guard: { up: number; shield: number; broken: boolean; blocked: readonly Blocked[] } = {
  up: 0,
  shield: 0,
  broken: false,
  blocked: [],
};
rememberPerSeat(objectMemory(guard, true));

/** raise the guard, cutting a blow's follow-through like the dodge does; `fresh` opens the parry window */
function raise(fresh: boolean): boolean {
  if (hero.state === "guard") return true;
  if (!maySharedAct()) return false;
  cutForSharedAction();
  hero.running = false;
  guard.broken = false;
  guard.up = fresh ? 0 : HERO_GUARD.parryWindow;
  setState("guard");
  return true;
}

/** K pressed: raise the guard with its parry window open */
export const pressGuard = (): boolean => raise(true);

/**
 * K still held once the hero is able again (the press came during a move): the guard goes up, with no parry window. A
 * guard that broke stays down while K is only held: it takes a fresh press to raise it again.
 */
export function holdGuard(): void {
  if (guard.broken) return;
  if (isHeld("guard") && hero.state !== "guard" && hero.state !== "hurt" && hero.state !== "dead") raise(false);
}

/** the guard holds while K does; stamina waits to come back while it is up; its clip loops the held segment */
export function runGuard(dt: number): void {
  const h = hero;
  guard.up += dt;
  if (!isHeld("guard")) return settle();
  h.vx *= 0.8;
  h.staminaWait = Math.max(h.staminaWait, STAMINA.delay);
  const t = GUARD_TIMES;
  if (h.st >= t.loopTo && h.st < t.block) h.st -= t.loopTo - t.loopFrom;
  else if ((h.st >= t.blockEnd && h.st < t.parry) || h.st >= t.parryEnd) h.st = t.loopFrom;
}

/** the shield after a parry runs down, and each blocked foe's gap with it */
export function tickGuard(dt: number): void {
  guard.shield = Math.max(0, guard.shield - dt);
  if (guard.blocked.length)
    guard.blocked = guard.blocked.map((b) => ({ foe: b.foe, left: b.left - dt })).filter((b) => b.left > 0);
}

/** this foe's last blow was blocked a moment ago: the blow now is the same touch */
const justBlocked = (foe: Enemy | null): boolean => !!foe && guard.blocked.some((b) => b.foe === foe);

/** the guard stopped this foe's blow: its blows stop for nothing until the gap runs out */
function noteBlocked(foe: Enemy | null): void {
  if (foe) guard.blocked = [...guard.blocked.filter((b) => b.foe !== foe), { foe, left: HERO_GUARD.blockGap }];
}

/** the living foe nearest where the blow came from, close enough to have thrown it */
function attackerAt(fromX: number): Enemy | null {
  let best: Enemy | null = null;
  let bestGap: number = HERO_GUARD.attackerReach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const gap = Math.abs(enemyCenter(e)[0] - fromX);
    if (gap < bestGap) {
      best = e;
      bestGap = gap;
    }
  }
  return best;
}

/**
 * Out of stamina the blow breaks through: the bar flashes and the blow lands as if the hero stood open. The guard
 * stays down until K is pressed again.
 */
function guardBreak(): boolean {
  guard.broken = true;
  hero.stamina = 0;
  hero.staminaWait = STAMINA.delay;
  refuseDash();
  cue(hero.x, hero.y - 38, "broken");
  settle();
  return false;
}

/** a blow stopped on the guard: stamina spent, a share of the damage through, a jolt back and sparks */
function block(dmg: number, fromX: number, foe: Enemy | null): boolean {
  const h = hero;
  const style = kit().guard;
  if (h.stamina < style.blockCost) return guardBreak();
  noteBlocked(foe);
  h.stamina -= style.blockCost;
  h.staminaWait = STAMINA.delay;
  const through = Math.round(dmg * style.chip * kit().hurtScale());
  if (through > 0) h.hp = Math.max(1, h.hp - through);
  h.vx = -h.face * HERO_GUARD.pushback;
  h.st = GUARD_TIMES.block;
  h.inv = Math.max(h.inv, 0.12);
  game.fx.push(createImpact(h.x + h.face * 9, h.y - 19, -h.face, false, SPARKS.hot));
  hitStop(0.05);
  shake(0.1, 1.2);
  sfx.block();
  emitSkillEvent({ type: "block", fromX });
  style.blocked?.(fromX, foe);
  return true;
}

/** a blow met in the parry window: nothing taken, the attacker reels, a beat of slow motion, then the hero's own reward */
function parry(fromX: number, foe: Enemy | null): void {
  const h = hero;
  noteBlocked(foe);
  if (foe) {
    if (foe.rank === "minion") staggerFoe(foe, HERO_GUARD.parryStagger);
    else foe.flash = 0.1;
  }
  guard.shield = HERO_GUARD.parryShield;
  h.st = GUARD_TIMES.parry;
  h.mp = Math.min(progress.stats.mp, h.mp + HERO_GUARD.parryMp);
  refundStamina(HERO_GUARD.parryStamina);
  feat({ kind: "perfect" });
  addFlow(FLOW.perfectDodge);
  game.slow = HERO_GUARD.parrySlow;
  cue(h.x, h.y - 38, "parry");
  game.fx.push(createImpact(h.x + h.face * 10, h.y - 20, h.face, true, SPARKS.hot));
  game.fx.push(createFloorRing(h.x, h.y, 26, skin.ramp, 0.35));
  lights.add(h.x + h.face * 8, h.y - 20, 44, skin.ramp[4], 0.8, 0.3);
  hitStop(0.09);
  shake(0.15, 2);
  sfx.perfect();
  emitSkillEvent({ type: "parry", fromX });
  kit().guard.parried(fromX, foe);
}

/**
 * A blow on the guard: from the front it is parried in the opening moment and blocked after; from behind it lands. A
 * blow the hero could not have been hurt by, and a second blow of the touch just blocked, stop for nothing.
 */
export function guardTakes(dmg: number, fromX: number): boolean {
  const h = hero;
  if (guard.shield > 0) return true;
  if (h.state !== "guard") return false;
  if ((fromX - h.x) * h.face < -HERO_GUARD.frontSlack) return false;
  if (h.inv > 0) return true;
  const foe = attackerAt(fromX);
  if (justBlocked(foe)) return true;
  if (guard.up < HERO_GUARD.parryWindow) {
    parry(fromX, foe);
    return true;
  }
  return block(dmg, fromX, foe);
}

/** the guard is up and still inside its parry window, for kits that draw the moment */
export const parryOpen = (): boolean => hero.state === "guard" && guard.up < HERO_GUARD.parryWindow;

/** a fresh run */
export function resetGuard(): void {
  guard.up = 0;
  guard.shield = 0;
  guard.broken = false;
  guard.blocked = [];
}
