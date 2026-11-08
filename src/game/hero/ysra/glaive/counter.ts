import { W } from "../../../../constants/stage";
import { createBurningSpear } from "../../../effects/burningSpear";
import { skillEvolved, skillValues } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { struckThisSwing } from "../../../world";
import { refundStamina } from "../../stamina";
import { buffs } from "../buffs";
import type { GlaiveTune } from "./reach";

const counter = () => skillValues("y_counter");

/** the counter thrust's power without the skill's payoff */
const PLAIN = 3.75;

/** the counter's power, its reach down the line (the whole stage once evolved), and its sure crit; a precise payoff,
 *  so the rest of the line takes the plain thrust */
export const counterTune: GlaiveTune = {
  power: () => counter().power ?? PLAIN,
  plain: () => PLAIN,
  reach: () => (counter().beam ? W : (counter().line ?? 0)),
  crit: () => !!counter().crit,
};

/** Sun Piercer: a burning spear of light runs from her point to the stage edge */
function beam(): void {
  const y = hero.y - 17;
  const x1 = hero.face > 0 ? W + 20 : -20;
  game.fx.push(
    createBurningSpear({ x0: hero.x + hero.face * 20, y0: y, x1, y1: y, speed: 1400, delay: 0, pass() {}, end() {} }),
  );
}

/** the counter landed: the foes reel longer, stamina comes back, and Riposte or Sun Piercer's crits begin */
export function counterLanded(hits: number): void {
  const v = counter();
  if (skillEvolved("y_counter")) beam();
  if (hits <= 0) return;
  for (const e of game.enemies) if (struckThisSwing(e)) e.stun = Math.max(e.stun, v.stun ?? 0);
  if (v.refill) refundStamina(progress.stats.stamina);
  if (v.riposte) {
    buffs.riposte = v.riposteTime;
    buffs.riposteBonus = v.riposte;
  }
  if (v.critTime) buffs.crits = v.critTime;
}
