import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { FISSURE } from "../constants/heft";
import { HEAVY } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { createCrescentWave } from "./effects/heavyWave";
import { brynn } from "./state";

/** seconds after a blow lands that a J press makes the next swing heavy: Heavy Hands' window, or her own */
export const keenWindow = (): number => skillValues("br_heavy").window ?? HEAVY.window;

/** Mountain Hands (Heavy Hands evolved): a fissure runs ahead from the heavy swing */
function heavyFissure(share: number): void {
  game.fx.push(
    createFloorWave({
      x: hero.x + hero.face * 20,
      y: hero.y,
      face: hero.face,
      reach: FISSURE.reach,
      speed: FISSURE.speed,
      damage: progress.stats.ad * FISSURE.power * share,
      stun: FISSURE.stun,
      kind: "fissure",
    }),
  );
}

/** a heavy swing landed: a crimson crescent flies off the blade along the swing's line, the streak grows */
export function heavyLanded(): void {
  const v = skillValues("br_heavy");
  brynn.heavyStreak++;
  game.fx.push(
    createCrescentWave({
      x: hero.x + hero.face * 16,
      y: hero.y - 18,
      face: hero.face,
      reach: HEAVY.waveReach * (1 + (v.waveReach ?? 0)),
      damage: progress.stats.ad * (HEAVY.wave + (v.wave ?? 0)),
      scale: 1 + (v.waveReach ?? 0) * 0.5,
    }),
  );
  if (v.heavyFissure && hero.ground) heavyFissure(v.heavyFissure);
}
