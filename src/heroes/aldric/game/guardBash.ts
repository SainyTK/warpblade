import { GUARD_TIMES, HERO_MOVE } from "../../../constants/combat";
import { FEEL } from "../../../constants/combo";
import { runGuard } from "../../../game/hero/heroGuard";
import { isHeld } from "../../../game/input";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import { GUARD, GUARD_BASH, VALOR } from "../constants/kit";
import { shieldBlow } from "./bash";
import { radiantWave } from "./radiance";
import { aldric } from "./state";
import { gainValor } from "./valor";
import "../types/events";

/** the guard walk's speed: a share of his walk, more with Iron Vow */
export const guardWalkSpeed = (): number =>
  HERO_MOVE.walkSpeed * progress.stats.move * (GUARD.walk + (skillValues("al_vow").walk ?? 0));

/** J with the guard up: a Guard bash, a Counterbash when a block came a moment ago; the guard stays up through it */
export function pressGuardBash(): boolean {
  if (hero.state !== "guard") return false;
  if (aldric.bashT >= 0 || aldric.bashCd > 0) return false;
  aldric.bashT = 0;
  aldric.bashCd = GUARD_BASH.every;
  aldric.counter = aldric.sinceBlock <= GUARD_BASH.counterWindow + (skillValues("al_retort").window ?? 0);
  aldric.waved = false;
  sfx.swing(aldric.counter ? 0.75 : 0.9);
  if (aldric.counter) sfx.chime(1);
  return true;
}

/** the bash meets the foe: Valor, Radiance's wave, and the event his skills answer */
function strikeBash(): void {
  const counter = aldric.counter;
  const retort = skillValues("al_retort");
  const power = counter ? GUARD_BASH.counterPower * (retort.power ?? 1) : GUARD_BASH.power;
  const hits = shieldBlow({
    power,
    kx: GUARD_BASH.kx * (counter ? 2 : 1),
    ky: -20,
    stagger: GUARD_BASH.stagger,
    big: true,
    sureCrit: counter,
    feel: counter ? FEEL.heavy : FEEL.firm,
  });
  if (!hits) return;
  gainValor(counter ? VALOR.counter : VALOR.guardBash);
  radiantWave();
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
  if (aldric.bashT < 0) return;
  const before = aldric.bashT;
  aldric.bashT += dt;
  if (before < GUARD_BASH.hit && aldric.bashT >= GUARD_BASH.hit) strikeBash();
  if (aldric.bashT >= GUARD_BASH.dur) aldric.bashT = -1;
}
