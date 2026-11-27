import { GUARD_TIMES, HERO_MOVE } from "../../../constants/combat";
import { FEEL } from "../../../constants/combo";
import { runGuard } from "../../../game/hero/heroGuard";
import { refundStamina } from "../../../game/hero/stamina";
import { isHeld } from "../../../game/input";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { GUARD, GUARD_BASH, VALOR } from "../constants/kit";
import { RETORT_WAVE, RETRIBUTION_BOX } from "../constants/skillNumbers";
import { shieldBlow } from "./bash";
import { createLightWave } from "./effects/lightWave";
import { radiantWave } from "./radiance";
import { aldric } from "./state";
import { gainValor, radiant } from "./valor";
import "../types/events";
import { aldricFx } from "./fx";

/** the guard walk's speed: a share of his walk, more with Iron Vow */
export const guardWalkSpeed = (): number =>
  HERO_MOVE.walkSpeed * progress.stats.move * (GUARD.walk + (skillValues("al_vow").walk ?? 0));

/** J with the guard up: a Guard bash, a Counterbash when a block came a moment ago; the guard stays up through it */
export function pressGuardBash(): boolean {
  if (hero.state !== "guard") return false;
  if (aldric.bashT >= 0 || aldric.bashCd > 0) return false;
  aldric.bashT = 0;
  aldric.bashCd = GUARD_BASH.every * (1 - (skillValues("al_vow").bashRate ?? 0));
  aldric.counter = aldric.sinceBlock <= GUARD_BASH.counterWindow + (skillValues("al_retort").window ?? 0);
  aldric.waved = false;
  sfx.swing(aldric.counter ? 0.75 : 0.9);
  if (aldric.counter) sfx.chime(1);
  return true;
}

/** Iron Retort on a Counterbash that struck: stamina back, its wave of light, the knock-down and more Radiance */
function retort(foe: Enemy | null): void {
  const v = skillValues("al_retort");
  const guard = { x: hero.x + hero.face * 12, y: hero.y - 19, face: hero.face, reach: 12 };
  aldricFx("al_retort", "burst", guard, {
    damage: progress.stats.ad * GUARD_BASH.counterPower * (v.power ?? 1),
    sigil: "shield",
  });
  if (skillEvolved("al_retort")) {
    for (const side of [1, -1]) {
      const crescent = { x: hero.x + side * 6, y: hero.y - 18, face: side, reach: 18 };
      aldricFx("al_retort", "slash", crescent, { quiet: true, delay: 0.04 });
    }
  }
  if (v.refund) refundStamina(v.refund);
  if (foe && v.stun) foe.stun = Math.max(foe.stun, v.stun);
  if (v.extend) {
    if (radiant()) aldric.radiance += v.extend;
    else gainValor(VALOR.counter);
  }
  if (!v.wave) return;
  const rises = skillEvolved("al_retort") ? [-RETORT_WAVE.spread, 0, RETORT_WAVE.spread] : [0];
  for (const rise of rises)
    game.fx.push(
      createLightWave(hero.x + hero.face * 14, hero.y - 20, hero.face, {
        speed: RETORT_WAVE.speed,
        reach: RETORT_WAVE.reach,
        half: RETORT_WAVE.half,
        damage: progress.stats.ad * v.wave,
        pierce: false,
        rise,
      }),
    );
}

/** the bash meets the foe: Valor, Radiance's wave, Iron Retort on a Counterbash, and the event his skills answer */
function strikeBash(): void {
  const counter = aldric.counter;
  const retortValues = skillValues("al_retort");
  const power = counter ? GUARD_BASH.counterPower * (retortValues.power ?? 1) : GUARD_BASH.power;
  const reach = 1 + (skillValues("al_vow").reach ?? 0);
  const wide = counter && skillEvolved("al_retort");
  const hits = shieldBlow(
    {
      power,
      kx: GUARD_BASH.kx * (counter ? 2 : 1),
      ky: -20,
      stagger: GUARD_BASH.stagger,
      big: true,
      sureCrit: counter,
      feel: counter ? FEEL.heavy : FEEL.firm,
    },
    wide ? RETRIBUTION_BOX : undefined,
    reach,
  );
  if (!hits) return;
  gainValor(counter ? VALOR.counter : VALOR.guardBash);
  radiantWave();
  if (counter) retort(hero.lastHit);
  emitSkillEvent({ type: "guardBash", counter, foe: hero.lastHit });
}

/** the walk behind the shield, at a share of his speed; he never turns, so he backs away facing the foe */
function guardWalk(dt: number): void {
  const h = hero;
  const jolted = h.st >= GUARD_TIMES.block && h.st < GUARD_TIMES.blockEnd;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  if (!jolted) h.vx = h.ground ? dir * guardWalkSpeed() : h.vx;
  aldric.guardStride += h.vx * h.face * dt;
}

/** the guard: the shared hold, the walk behind it and a Guard bash under way */
export function runAldricGuard(dt: number): void {
  runGuard(dt);
  if (hero.state !== "guard") {
    aldric.bashT = -1;
    return;
  }
  guardWalk(dt);
  const regen = skillValues("al_vow").regen;
  if (regen) refundStamina(regen * dt);
  if (aldric.bashT < 0) return;
  const before = aldric.bashT;
  aldric.bashT += dt;
  if (before < GUARD_BASH.hit && aldric.bashT >= GUARD_BASH.hit) strikeBash();
  if (aldric.bashT >= GUARD_BASH.dur) aldric.bashT = -1;
}
