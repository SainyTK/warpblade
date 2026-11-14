import { KEEN, KEEN_RAMP } from "../../../../constants/combo";
import { dealDamage } from "../../../../game/damage";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { movePayoff } from "../../../../game/skills/payoff";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { hitStop } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { createEchoCut } from "../effects/echoCut";
import { vesper } from "../state";
import { gainTempo, tempoMost } from "../tempo";

const ID = "ve_keen";
/** Perfect Pair's cross: both blades' arcs in gold on the foe */
const PAIR_A = {
  cx: 0,
  cy: 0,
  R: 22,
  sy: 0.9,
  rot: 0.8,
  a0: -2.6,
  a1: 0.9,
  W: 8,
  hold: 0.07,
  trail: 0.28,
  ramp: KEEN_RAMP,
};
const PAIR_B = { ...PAIR_A, rot: -0.8 };

/** seconds after a blow lands that a J press is Keen: Twin Keen's window, or the shared one */
export const keenWindow = (): number => skillValues(ID).window ?? KEEN.window;

/** the foe a Keen move paid off on: the first its blows reached */
const payoffFoe = (): Enemy | null => [...movePayoff()].find((e) => e.hp > 0) ?? null;

/**
 * A move's blow is out. Twin Keen: a Keen move grows the streak, then on its foe sends an echo cut, at the moonrise fills
 * Tempo, gives MP, and as Perfect Pair cuts it again with both blades in gold. Any other move breaks the streak.
 */
export function keenAfterStrike(id: string, last: boolean): void {
  if (!last) return;
  if (!hero.keen) {
    vesper.keenStreak = 0;
    return;
  }
  vesper.keenStreak++;
  const v = skillValues(ID);
  const foe = payoffFoe();
  if (!foe) return;
  if (v.echoKeen) game.fx.push(createEchoCut(foe, progress.stats.ad * v.echoKeen, 0.05));
  if (v.keenTop && id === "moonrise") gainTempo(tempoMost());
  if (v.mp) hero.mp = Math.min(progress.stats.mp, hero.mp + v.mp);
  if (!skillEvolved(ID)) return;
  const [x, y] = enemyCenter(foe);
  game.fx.push(createSlash(x, y, hero.face, PAIR_A));
  game.fx.push(createSlash(x, y, -hero.face, PAIR_B));
  dealDamage(foe, progress.stats.ad * v.cross, {
    fromX: hero.x,
    kx: hero.face * 60,
    ky: -60,
    heavy: true,
    melee: true,
  });
  hitStop(0.08);
}
