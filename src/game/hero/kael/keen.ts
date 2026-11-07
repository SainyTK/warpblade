import { KEEN, KEEN_RAMP } from "../../../constants/combo";
import { sfx } from "../../../services/audio";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { createCrystalWave } from "../../effects/crystalWave";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { enemyCenter } from "../../enemies/enemy";
import { skillEvolved, skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { hitStop, shake } from "../../world";
import { kael } from "./state";

const SKILL = "k_keen";
/** the gold cross cut: two crescents crossing on the foe */
const CROSS_A = {
  cx: 0,
  cy: 0,
  R: 26,
  sy: 0.9,
  rot: 0.8,
  a0: -2.6,
  a1: 0.9,
  W: 9,
  hold: 0.08,
  trail: 0.3,
  ramp: KEEN_RAMP,
};
const CROSS_B = { ...CROSS_A, rot: -0.8 };

/** seconds after a blow lands that a J press is Keen: Keen Edge's window, or the base one */
export const keenWindow = (): number => skillValues(SKILL).window ?? KEEN.window;

/** Peerless Edge's free Keen: every move is Keen for a while */
export const alwaysKeen = (): boolean => kael.freeKeen > 0;

/** Peerless Edge: a gold cross cut on the foe ahead and the foes around it, then free Keen */
function crossCut(): void {
  const v = skillValues(SKILL);
  const foe = hero.lastHit && hero.lastHit.hp > 0 ? hero.lastHit : null;
  const [x, y] = foe ? enemyCenter(foe) : [hero.x + hero.face * 20, hero.y - 20];
  game.fx.push(createSlash(x, y, hero.face, CROSS_A));
  game.fx.push(createSlash(x, y, -hero.face, CROSS_B));
  lights.add(x, y, 70, KEEN_RAMP[4], 1, 0.4);
  lights.add(x, y, 20, WHITE, 0.9, 0.12);
  const reach = withCharms("area", v.crossReach);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (e !== foe && Math.hypot(ex - x, ey - y) > reach) continue;
    dealDamage(e, progress.stats.ad * (e === foe ? v.cross : v.crossArea), {
      fromX: hero.x,
      kx: Math.sign(ex - hero.x) * 120,
      ky: -80,
      heavy: true,
      melee: true,
    });
    game.fx.push(createImpact(ex, ey, Math.sign(ex - hero.x) || 1, true));
  }
  hitStop(0.14);
  shake(0.35, 4);
  sfx.chime(4);
  kael.freeKeen = withCharms("duration", v.free);
  kael.keenCount = 0;
}

/**
 * A move's last blow is out: a Keen move that landed grows the streak, sends Keen Edge's crystal wave and counts toward
 * Peerless Edge's cross cut; any other move breaks the streak.
 */
export function afterKeenMove(hits: number): void {
  if (!hero.keen || hits === 0) {
    kael.keenStreak = 0;
    return;
  }
  kael.keenStreak++;
  if (kael.stormLeft > 0) kael.stormVolleys++;
  const v = skillValues(SKILL);
  if (v.wave)
    game.fx.push(createCrystalWave(hero.x + hero.face * 10, hero.y - 18, hero.face, progress.stats.ad * v.wave));
  if (!skillEvolved(SKILL) || kael.freeKeen > 0) return;
  kael.keenCount++;
  if (kael.keenCount >= v.crossEvery) crossCut();
}
