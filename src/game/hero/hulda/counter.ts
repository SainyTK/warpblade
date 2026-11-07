import { ENEMIES } from "../../../constants/enemies";
import { COUNTER } from "../../../constants/hulda/counter";
import { FURY } from "../../../constants/hulda/fury";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillLevel, skillValues } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { skin } from "../skin";
import { gainFury } from "./fury";
import { gainGrit, maxGrit } from "./grit";
import { hulda } from "./memory";

const ID = "h_counterGrab";

/** the grab meets a foe winding up a blow, or comes in the safe time after a plate broke once the skill allows it */
function isCounter(e: Enemy): boolean {
  if (!skillLevel(ID)) return false;
  return COUNTER.states.includes(e.state) || (skillValues(ID).afterBreak === 1 && hulda.safe > 0);
}

/** the roar of a counter: every other foe near reels */
function roar(caught: Enemy): void {
  for (const e of game.enemies) {
    if (e === caught || e.hp <= 0) continue;
    if (Math.abs(enemyCenter(e)[0] - hero.x) > COUNTER.roarReach) continue;
    e.stun = Math.max(e.stun, COUNTER.roarStun);
  }
  game.fx.push(createFloorRing(hero.x, hero.y, COUNTER.roarReach, skin.ramp, 0.35));
}

/** the flash of a counter: a white burst at her hands, a long hit-stop and a heavy shake */
function flash(e: Enemy): void {
  const [cx, cy] = enemyCenter(e);
  game.fx.push(
    createImpact(cx - hero.face * 3, cy, hero.face, true, [WHITE, skin.ramp[6], skin.ramp[5], skin.ramp[4]]),
  );
  lights.add(cx, cy, 40, WHITE, 0.9, 0.18);
  hitStop(COUNTER.stop);
  shake(COUNTER.shake[0], COUNTER.shake[1]);
  sfx.hit(true, 0.5);
  sfx.boom();
}

/**
 * Iron Counter: a grab that catches a foe winding up hits it very hard, gives a plate (all of them at level 8), Fury, a
 * doubled next throw and a roar, as the level allows. Evolved, a mini or boss is held for the grip's suplex and no plate
 * breaks while Fury lasts. Every grab clears a counter's leftovers first. Returns whether the grab was a counter.
 */
export function counterGrab(e: Enemy): boolean {
  hulda.execute = false;
  hulda.counterThrow = 1;
  if (!isCounter(e)) return false;
  const v = skillValues(ID);
  const big = !ENEMIES[e.type].launchable;
  e.state = "recover";
  e.st = 0;
  flash(e);
  dealDamage(e, progress.stats.ad * v.power * (big ? v.big : 1), { fromX: hero.x, kx: 0, heavy: true, melee: true });
  hero.lastHit = e;
  if (v.fullPlates) hulda.grit = maxGrit();
  else gainGrit(GRIT.plate);
  gainFury(v.fury);
  if (v.unbreakable) hulda.unbreakT = FURY.time;
  hulda.counterThrow = v.throwScale;
  hulda.execute = big && v.hold === 1 && e.hp > 0;
  if (v.roar) roar(e);
  emitSkillEvent({ type: "counter", foe: e });
  return true;
}

/** Executioner's Grip: the big foe in her hands is the grip's; it is suplexed for the grip's damage */
export const executing = (): boolean => hulda.execute;

/** the damage multiple a throw takes from a counter, spent by the throw */
export function spendCounterThrow(): number {
  const scale = hulda.counterThrow;
  hulda.counterThrow = 1;
  return scale;
}

/** a suplex's damage multiple: the evolved grip's own on its big foe, otherwise the base times a counter's throw
 *  multiple; spends both */
export function spendSuplex(base: number): number {
  const scale = spendCounterThrow();
  const power = hulda.execute ? skillValues(ID).suplex : base * scale;
  hulda.execute = false;
  return power;
}
