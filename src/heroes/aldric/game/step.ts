import { refundStamina } from "../../../game/hero/stamina";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { STEP } from "../constants/skillNumbers";
import { raiseBarrier } from "./barrier";
import { createDelayedRing } from "./effects/delayedRing";
import { strikeEach } from "./strike";
import { gainValor } from "./valor";

/** stamina this dodge has given back, so the refund has a ceiling */
const step = { refunded: 0 };
rememberPerSeat(objectMemory(step, true));

/** Shield Step: the dodge starts */
function started(): void {
  step.refunded = 0;
}

/** a foe the dodge passes takes a shield blow; Valor and stamina for each */
function passed(e: Enemy): void {
  const v = skillValues("al_step");
  if (!v.power) return;
  strikeEach([e], progress.stats.ad * v.power, {
    fromX: hero.x - hero.face * 6,
    kx: 60,
    ky: -30,
    stagger: 0.5,
    heavy: true,
  });
  if (v.valor) gainValor(v.valor);
  if (v.refund && step.refunded < v.refund * 2) {
    refundStamina(v.refund);
    step.refunded += v.refund;
  }
}

/** the dodge ends behind a Bulwark, and as Phalanx Step in a ring of light */
function ended(): void {
  const v = skillValues("al_step");
  const evolved = skillEvolved("al_step");
  if (v.barrier) raiseBarrier(STEP.barrier, evolved ? 2 : 1);
  if (evolved)
    game.fx.push(
      createDelayedRing(hero.x, hero.y, withBuild("area", STEP.ring), 0, progress.stats.ad * v.ring, {
        kx: 80,
        ky: -50,
        heavy: true,
      }),
    );
}

/** the dodge's hooks for Shield Step */
export const SHIELD_STEP = { started, passed, ended };
