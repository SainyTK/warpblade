import { STAMINA } from "../../../../constants/combat";
import { SPARKS } from "../../../../constants/palette";
import { BACKSTEP, BRACE, BRACE_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { cue } from "../../../cue";
import { createImpact } from "../../../effects/impact";
import { isHeld } from "../../../input";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { hitStop, shake } from "../../../world";
import { setState, settle } from "../../actions";
import { refuseDash } from "../../stamina";
import { emitYsra } from "../events";
import { startBackstep } from "./backstep";
import { cutMove } from "./cut";
import { stance } from "./memory";
import { parry, parryWindow } from "./parry";

/** L on the floor: raise the brace; it holds while L does */
export function startBrace(): void {
  cutMove();
  hero.running = false;
  stance.braced = 0;
  setState("brace");
}

/** the guard holds while L is held and she stands, and a side held away hops her back out of it; its clip loops the held segment and runs a jolt or a snap once */
export function runBrace(dt: number): void {
  const h = hero;
  stance.braced += dt;
  if (!isHeld("dash") || !h.ground) return settle();
  // stamina does not come back while she holds the guard up
  h.staminaWait = Math.max(h.staminaWait, STAMINA.delay);
  const away = isHeld(h.face > 0 ? "left" : "right") && !isHeld(h.face > 0 ? "right" : "left");
  if (away && h.stamina >= BACKSTEP.cost) {
    startBackstep();
    return;
  }
  const t = BRACE_TIMES;
  if (h.st >= t.loopTo && h.st < t.block) h.st -= t.loopTo - t.loopFrom;
  else if ((h.st >= t.blockEnd && h.st < t.parry) || h.st >= t.parryEnd) h.st = t.loopFrom;
}

/** stamina one block costs: Counter Thrust takes a share off */
const blockCost = (): number => BRACE.blockCost * (1 - (skillValues("y_counter").firm ?? 0));

/** out of stamina the blow breaks through: the bar flashes, and the blow lands as if she stood open */
function guardBreak(): boolean {
  hero.stamina = 0;
  hero.staminaWait = STAMINA.delay;
  refuseDash();
  cue(hero.x, hero.y - 38, "broken");
  return false;
}

/** a blow stopped on the haft: stamina spent, a jolt back, sparks off the glaive */
function block(fromX: number): boolean {
  const h = hero;
  const cost = blockCost();
  if (h.stamina < cost) return guardBreak();
  h.stamina -= cost;
  h.staminaWait = STAMINA.delay;
  stance.shield = BRACE.shieldTime;
  h.vx = -h.face * BRACE.pushback;
  h.st = BRACE_TIMES.block;
  game.fx.push(createImpact(h.x + h.face * 9, h.y - 19, -h.face, false, SPARKS.hot));
  hitStop(0.05);
  shake(0.1, 1.2);
  sfx.block();
  emitYsra("block", { fromX });
  emitSkillEvent({ type: "block", fromX });
  return true;
}

/** a blow on the brace: from the front it is parried in the opening moment and blocked after; from behind it lands */
export function braceTakes(fromX: number): boolean {
  const h = hero;
  if (h.state !== "brace" || h.inv > 0) return false;
  if ((fromX - h.x) * h.face < -BRACE.frontSlack) return false;
  if (stance.shield > 0) return true;
  if (stance.braced < parryWindow()) {
    parry(fromX);
    return true;
  }
  return block(fromX);
}
