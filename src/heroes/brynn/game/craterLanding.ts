import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { FISSURE } from "../constants/heft";
import { SHOCKWAVE } from "../constants/string";
import { createFloorWave } from "./effects/floorWave";
import { addHeft } from "./heft";

const ID = "br_crater";

/** what Crater Leap adds to the falling slam's landing: shockwaves or fissures both ways, and Heft */
export function craterLanding(reach: number): void {
  const v = skillValues(ID);
  addHeft(v.heft ?? 0);
  if (!v.waves) return;
  const fissure = skillEvolved(ID);
  for (const face of [hero.face, -hero.face])
    game.fx.push(
      createFloorWave({
        x: hero.x + face * reach * 0.5,
        y: hero.y,
        face,
        reach: fissure ? FISSURE.reach : SHOCKWAVE.reach,
        speed: fissure ? FISSURE.speed : SHOCKWAVE.speed,
        damage: progress.stats.ad * (fissure ? FISSURE.power + v.waves : v.waves),
        stun: fissure ? FISSURE.stun : SHOCKWAVE.stun,
        kind: fissure ? "fissure" : "shock",
      }),
    );
}
