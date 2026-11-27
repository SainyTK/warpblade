import { skillValues } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { SKILL } from "../constants/skillIds";
import { SPIRIT } from "../constants/swords";
import { BREATH, yunFx } from "./fx";
import { yun } from "./state";

/** the most spirit swords he can hold now: Sage's Breath adds to it */
export const mostSwords = (): number => Math.min(SPIRIT.cap, SPIRIT.most + (skillValues(SKILL.breath).most ?? 0));
/** how many come back on their own */
const restSwords = (): number => Math.min(mostSwords(), SPIRIT.rest + (skillValues(SKILL.breath).rest ?? 0));
/** seconds between swords coming back */
const regenTime = (): number => skillValues(SKILL.breath).regen ?? SPIRIT.regen;

/** spirit swords come back while he holds fewer than his resting count, and the timers of swords away and of the
 *  skills that give swords run down */
export function tickSwords(dt: number): void {
  for (let i = 0; i < yun.away.length; i++) yun.away[i] = Math.max(0, yun.away[i] - dt);
  yun.keenSwordCd = Math.max(0, yun.keenSwordCd - dt);
  yun.dodgeSwordCd = Math.max(0, yun.dodgeSwordCd - dt);
  if (yun.swords >= restSwords()) {
    yun.regen = regenTime();
    return;
  }
  yun.regen -= dt;
  if (yun.regen > 0) return;
  yun.regen = regenTime();
  yun.swords++;
  yunFx(
    SKILL.breath,
    "burst",
    { x: hero.x - hero.face * 12, y: hero.y - 32, face: hero.face, reach: 8 },
    { signature: BREATH },
  );
}

/** spirit swords join him, up to the most he can hold */
export function gainSwords(n: number): void {
  yun.swords = Math.min(mostSwords(), yun.swords + n);
}

/** every sword he can hold is back at once */
export function fillSwords(): void {
  yun.swords = mostSwords();
}

/** every held sword leaves: returns how many went */
export function spendSwords(): number {
  const n = yun.swords;
  yun.swords = 0;
  yun.regen = regenTime();
  return n;
}

/** a held sword thrusts out for this many seconds, so its place in the fan stands empty meanwhile */
export function sendAway(slot: number, seconds: number): void {
  yun.away[slot] = Math.max(yun.away[slot], seconds);
}

/** a phase for the swords' float, the same for every sword so the fan bobs together */
export const floatPhase = (): number => game.t;
