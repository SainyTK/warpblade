import { skillLevel, skillValues } from "../../../game/skills/query";
import { hero, progress, rng } from "../../../game/state";
import { FOCUS } from "../constants/focus";
import { SKILL } from "../constants/skills/ids";
import { bladeOut } from "./blade";
import { sayaFx } from "./skillFx";
import { sayaSound } from "./sound";
import { saya } from "./state";
import { onOwnTrail } from "./trail";

/** the breaths Focus holds: three, more with Deep Breath */
export const maxBreaths = (): number => FOCUS.max + (skillValues(SKILL.breath).more ?? 0);

/** a breath of Focus fills: a parry, a perfect dodge, a clean sheathe, or the blade at rest; Deep Breath heals */
export function gainBreath(): void {
  if (saya.breaths >= maxBreaths()) return;
  saya.breaths++;
  saya.rest = 0;
  if (skillLevel(SKILL.breath)) {
    sayaFx(SKILL.breath, { x: hero.x, y: hero.y, face: hero.face }, { damage: progress.stats.ad * 0.5 * saya.breaths });
  }
  const heal = skillValues(SKILL.breath).heal;
  if (heal) hero.hp = Math.min(progress.stats.hp, hero.hp + heal);
  sayaSound.breath();
}

/** a draw starts: it spends a breath when she has one (Boundless Breath may keep it), and then reaches farther and
 *  stores more */
export function beginDraw(): void {
  saya.breathDraw = saya.breaths > 0;
  if (!saya.breathDraw) return;
  const refund = skillValues(SKILL.breath).refund ?? 0;
  if (refund && rng.chance(refund)) return;
  saya.breaths--;
  saya.spent = FOCUS.flash;
}

/** the factor on what the draw under way stores */
export const drawStore = (): number => (saya.breathDraw ? FOCUS.store : 1);
/** px the draw under way reaches past its blow */
export const drawReach = (): number => (saya.breathDraw ? FOCUS.reach : 0);

/** seconds a breath takes to fill at rest: faster with Deep Breath and on her own trail */
function restTime(): number {
  const trail = skillValues(SKILL.trail).focus ?? 1;
  return (FOCUS.rest * (skillValues(SKILL.breath).rest ?? 1)) / (onOwnTrail(hero.x) ? trail : 1);
}

/** breaths fill while the blade rests and she is not hurt; a perfect dodge gives one, or more with Shadow Step */
export function tickFocus(dt: number): void {
  saya.spent = Math.max(0, saya.spent - dt);
  if (hero.state === "dash" && hero.perfectUsed && !saya.perfectSeen) {
    saya.perfectSeen = true;
    const n = skillValues(SKILL.step).perfect ?? 1;
    for (let i = 0; i < n; i++) gainBreath();
  }
  if (hero.state !== "dash") saya.perfectSeen = false;
  if (bladeOut() || hero.state === "hurt" || hero.state === "dead" || saya.breaths >= maxBreaths()) {
    saya.rest = 0;
    return;
  }
  saya.rest += dt;
  if (saya.rest >= restTime()) gainBreath();
}

/** the share toward the next breath, for the bar */
export const restShare = (): number => Math.min(1, saya.rest / restTime());

/** the factor on her walk: faster with Focus full and Deep Breath's fifth level */
export const breathWalk = (): number => (saya.breaths >= maxBreaths() ? (skillValues(SKILL.breath).move ?? 1) : 1);
