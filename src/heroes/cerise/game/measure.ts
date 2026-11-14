import { KEEN_RAMP } from "../../../constants/combo";
import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { createSlash } from "../../../game/effects/slash";
import { enemyCenter } from "../../../game/enemies/enemy";
import { meleeHit } from "../../../game/meleeHit";
import { movePayoff } from "../../../game/skills/payoff";
import { skillValues } from "../../../game/skills/query";
import { game, hero, lights, progress } from "../../../game/state";
import { boxAhead, hitStop, newSwing, shake } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { WHITE } from "../../../utils/color";
import { LUNGE_STREAK } from "./moves/slashes";
import { gainPoints } from "./points";
import { cerise } from "./state";

/** the rose star: a burst of four points on the foe */
const STAR = { cx: 0, cy: 0, R: 14, sy: 1, rot: 0, a0: -3.1, a1: 3.1, W: 3, hold: 0.06, trail: 0.25, ramp: KEEN_RAMP };

/** Perfect Measure: every few Keen blows in a row burst a rose star on the foe the Keen move paid off on, and give Points */
export function perfectMeasure(): void {
  const v = skillValues("ce_measure");
  cerise.keenCount++;
  if (cerise.keenCount < v.starEvery) return;
  cerise.keenCount = 0;
  const foe = [...movePayoff()].find((e) => e.hp > 0) ?? null;
  gainPoints(v.starPoints);
  if (!foe) return;
  const [x, y] = enemyCenter(foe);
  game.fx.push(createSlash(x, y, 1, STAR));
  lights.add(x, y, 50, KEEN_RAMP[4], 1, 0.35);
  lights.add(x, y, 14, WHITE, 0.9, 0.1);
  dealDamage(foe, progress.stats.ad * v.star, { fromX: hero.x, kx: hero.face * 80, heavy: true, melee: true });
  game.fx.push(createImpact(x, y, hero.face, true));
  hitStop(0.12);
  shake(0.3, 3.5);
  sfx.chime(4);
}

/** Measured Touch's seventh level: a Keen lunge strikes again along its line as it holds */
export function keenLungeAgain(power: number, reach: number): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...LUNGE_STREAK, cy: -19, ramp: KEEN_RAMP }));
  meleeHit([boxAhead(0, -26, 62 + reach, -6)], { power, kx: 20, ky: 0, sureCrit: true, plain: power * 0.5 });
}
