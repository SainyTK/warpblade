import { SPARKS } from "../../../../constants/palette";
import { BRACE, BRACE_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { cue } from "../../../cue";
import { createFloorRing } from "../../../effects/floorRing";
import { createImpact } from "../../../effects/impact";
import { enemyCenter } from "../../../enemies/enemy";
import { hasPerk } from "../../../progress";
import { game, hero, lights } from "../../../state";
import { hitStop } from "../../../world";
import { skin } from "../../skin";
import { refundStamina } from "../../stamina";
import { emitYsra } from "../events";
import { stance } from "./memory";

/** the parry window from the press; Ember Parry doubles it */
export const parryWindow = (): number => BRACE.parryWindow * (hasPerk("emberParry") ? 2 : 1);

/** the living foe nearest where the blow came from, close enough to have thrown it */
function attackerAt(fromX: number): Enemy | null {
  let best: Enemy | null = null;
  let bestGap: number = BRACE.attackerReach;
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

/** the attacker reels (bosses for half as long), and with Ember Parry catches fire */
function knockAside(fromX: number): void {
  const e = attackerAt(fromX);
  if (!e) return;
  const stun = BRACE.parryStun * (e.rank === "boss" ? 0.5 : 1);
  e.stun = Math.max(e.stun, stun);
  e.stagger = Math.max(e.stagger, stun);
  e.vx = hero.face * 60;
  e.flash = 0.1;
  if (hasPerk("emberParry")) e.burn = Math.max(e.burn, BRACE.emberBurn);
}

/** a blow met in the parry window: no cost, stamina back, the attacker knocked aside, a beat of slow motion, and Counter
 *  Thrust primed */
export function parry(fromX: number): void {
  const h = hero;
  knockAside(fromX);
  stance.shield = BRACE.shieldTime;
  refundStamina(BRACE.parryRefund);
  if (hasPerk("counterThrust")) stance.counter = BRACE.counterTime;
  h.st = BRACE_TIMES.parry;
  game.slow = BRACE.parrySlow;
  const fx = h.x + h.face * 10;
  game.fx.push(createImpact(fx, h.y - 20, -h.face, true, SPARKS.hot));
  game.fx.push(createFloorRing(h.x, h.y, 24, skin.ramp, 0.35));
  lights.add(fx, h.y - 20, 56, skin.ramp[4], 0.9, 0.35);
  cue(h.x, h.y - 38, "parry");
  hitStop(0.06);
  sfx.block();
  sfx.perfect();
  emitYsra("parry", { fromX });
}
