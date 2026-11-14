import { skillEvolved, skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { PILLAR } from "../constants/abilities";
import { SKYFALL } from "../constants/skillNumbers";
import { createSunPillar } from "./abilities/pillar";
import { raiseBarrier } from "./barrier";
import { createDawnGround } from "./effects/dawnGround";
import { gainValor } from "./valor";

/** Skyfall on Shield fall's landing: Valor for each foe, Bulwark, burning light, and as Falling Sun a pillar of dawn */
export function skyfall(hits: number): void {
  const v = skillValues("al_skyfall");
  if (v.valor && hits) gainValor(v.valor * hits);
  if (v.barrier) raiseBarrier(SKYFALL.barrier, 1);
  if (v.ground)
    game.fx.push(
      createDawnGround(
        hero.x,
        withCharms("area", SKYFALL.groundWidth),
        withCharms("duration", v.ground),
        progress.stats.ap * SKYFALL.burn,
      ),
    );
  if (skillEvolved("al_skyfall"))
    game.fx.push(
      createSunPillar({
        x: hero.x,
        delay: 0.05,
        damage: progress.stats.ap * PILLAR.power * v.pillar,
        stun: PILLAR.stun,
        half: PILLAR.half,
        source: "al_skyfall",
      }),
    );
}
