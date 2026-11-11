import { BEAT_STEP } from "../../../constants/jory/moves";
import { PAL } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, progress, rng } from "../../state";
import { boxHit, dust, heroBox } from "../../world";
import { isFree, setState, settle } from "../actions";
import { rewardPerfectDodge } from "../perfectDodge";
import { refuseDash } from "../stamina";
import { travelEnded } from "../travelEnd";
import { judge, tier } from "./beat";
import { jory, joryHost } from "./memory";
import { stepCost } from "./stepSkills";
import { inRecovery } from "./string";

/** the slide's start and end in the step's clock: after the load, before the landing */
const SLIDE_FROM = BEAT_STEP.load;
const SLIDE_TO = BEAT_STEP.load + BEAT_STEP.slide;

/** L: Beat Step in the held direction, or backward with none held, judged against the beat */
export function pressStep(dir: number): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (jory.stepWait > 0) return false;
  if (!h.ground && !jory.airStep) return false;
  const cost = stepCost();
  if (cost > 0 && h.stamina < cost) {
    refuseDash();
    return true;
  }
  const judged = judge("L");
  h.stamina -= cost;
  h.staminaWait = 0.5;
  if (!h.ground) jory.airStep = false;
  const touch = 1 + (skillValues("j_stepTouch").reach ?? 0);
  const reach = BEAT_STEP.reach[tier() - 1] * progress.stats.move * touch * (h.ground ? 1 : BEAT_STEP.air);
  jory.stepDir = dir || -h.face;
  jory.stepLen = withCharms("area", reach);
  jory.stepOnBeat = judged.onBeat;
  jory.stepDodged = false;
  joryHost.passed = [];
  h.running = false;
  h.vx = 0;
  if (!h.ground) h.vy = 0;
  setState("beatStep");
  sfx.dodge();
  return true;
}

/** a ground foe's body he walks into: an off-beat step stops against it */
function blockedBy(e: Enemy): boolean {
  if (e.hp <= 0 || e.air || kindOf(e.type).flies) return false;
  if (e.rank === "boss") return false;
  const ahead = Math.sign(e.x - hero.x) === jory.stepDir;
  return ahead && boxHit(enemyBox(e), heroBox());
}

/** remember the ground foes the step has passed through, for the dash event and Step Touch */
function notePassed(fromX: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0 || joryHost.passed.includes(e)) continue;
    const crossed = Math.sign(e.x - fromX) === jory.stepDir && Math.sign(e.x - hero.x) !== jory.stepDir;
    if (crossed && Math.abs(e.y - hero.y) < 24) joryHost.passed.push(e);
  }
}

/** the step under way: the load on the back foot, the long low slide, and the landing into the knees */
export function runStep(): void {
  const h = hero;
  if (h.st < SLIDE_FROM) {
    h.vx = 0;
    return;
  }
  if (h.st < SLIDE_TO) {
    const fromX = h.x;
    h.vx = (jory.stepDir * jory.stepLen) / BEAT_STEP.slide;
    if (!h.ground) h.vy = 0;
    if (!jory.stepOnBeat && game.enemies.some(blockedBy)) h.vx = 0;
    notePassed(fromX);
    if (h.ground && rng.chance(0.3)) dust(h.x - jory.stepDir * 4, h.y, 1);
    return;
  }
  if (h.vx !== 0) endSlide();
  h.vx = 0;
  if (h.st >= SLIDE_TO + BEAT_STEP.land || !h.ground) settle();
}

/** the slide is over: Aftershock and every other travel answer, and the dash event with the foes passed */
function endSlide(): void {
  const h = hero;
  h.vx = 0;
  jory.stepWait = BEAT_STEP.wait;
  if (jory.stepOnBeat) game.fx.push(createFloorRing(h.x, h.y, 16, PAL.beat, 0.25));
  travelEnded();
  emitSkillEvent({ type: "dash", dir: jory.stepDir, foes: joryHost.passed });
}

/** he cannot be touched for the whole of an on-beat step; a blow in its first moment is a perfect dodge, once */
export function stepAbsorbs(): boolean {
  const h = hero;
  if (h.state !== "beatStep" || !jory.stepOnBeat || h.st >= SLIDE_TO) return false;
  if (h.st <= BEAT_STEP.dodge && !jory.stepDodged) {
    jory.stepDodged = true;
    rewardPerfectDodge();
    game.fx.push(createFloorRing(h.x, h.y, 28, PAL.beat, 0.4));
    sfx.perfect();
  }
  return true;
}

/** the step is sliding now */
export const sliding = (): boolean => hero.state === "beatStep" && hero.st >= SLIDE_FROM && hero.st < SLIDE_TO;

/** the wait runs down */
export function tickStep(dt: number): void {
  jory.stepWait = Math.max(0, jory.stepWait - dt);
}
