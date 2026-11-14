import { game, hero, progress } from "../../../game/state";
import { RADIANCE } from "../constants/kit";
import { createLightWave } from "./effects/lightWave";
import { aldric } from "./state";
import { radiant } from "./valor";

/** a blow of his landed while Radiance runs: once per move, a short wave of light flies on ahead */
export function radiantWave(): void {
  if (!radiant() || aldric.waved) return;
  aldric.waved = true;
  game.fx.push(
    createLightWave(hero.x + hero.face * 14, hero.y - 20, hero.face, {
      speed: RADIANCE.speed,
      reach: RADIANCE.reach,
      half: RADIANCE.half,
      damage: progress.stats.ad * RADIANCE.wave,
      pierce: true,
    }),
  );
}
