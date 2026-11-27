import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { PILLAR } from "../constants/abilities";
import { SKYFALL } from "../constants/skillNumbers";
import { createSunPillar } from "./abilities/pillar";
import { raiseBarrier } from "./barrier";
import { createDawnGround } from "./effects/dawnGround";
import { aldricFx } from "./fx";
import { gainValor } from "./valor";

/** Skyfall on Shield fall's landing: Valor for each foe, Bulwark, burning light, and as Falling Sun a pillar of dawn */
export function skyfall(hits: number): void {
  const v = skillValues("al_skyfall");
  const damage = progress.stats.ad * (v.power ?? 1) * 2;
  aldricFx(
    "al_skyfall",
    "nova",
    { x: hero.x, y: hero.y, face: hero.face, reach: 26 },
    { damage, sigil: "shield", lift: 18 },
  );
  if (skillEvolved("al_skyfall"))
    aldricFx("al_skyfall", "pillar", { x: hero.x, y: hero.y, reach: 30 }, { quiet: true, delay: 0.05 });
  if (v.valor && hits) gainValor(v.valor * hits);
  if (v.barrier) raiseBarrier(SKYFALL.barrier, 1);
  if (v.ground)
    game.fx.push(
      createDawnGround(
        hero.x,
        withBuild("area", SKYFALL.groundWidth),
        withBuild("duration", v.ground),
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
