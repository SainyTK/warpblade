import { skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { CRESCENT } from "../../constants/abilities";
import { SKILL } from "../../constants/skillIds";
import { TIDE_WAVE } from "../../constants/string";
import { createDelayed } from "../effects/delayed";
import { createQiWave, type QiWaveShape } from "../effects/qiWave";
import { CRESCENTS, yunFx } from "../fx";
import { gainSwords } from "../swords";

/**
 * Qi Crescent: a tall wave of qi leaves the jian and runs ahead, cutting each foe once; held, a second runs behind
 * him. From level 5 the first foe it cuts gives a spirit sword, and from level 7 a second crescent follows.
 */
export function castCrescent(wide: boolean): void {
  const v = skillValues(SKILL.crescent);
  let given = false;
  const shape: QiWaveShape = {
    reach: withBuild("area", v.reach),
    speed: CRESCENT.speed,
    damage: progress.stats.ap * v.power,
    half: CRESCENT.half * (v.tall ?? 1),
    stun: v.stun,
    source: "abilities",
    first: () => {
      if (!v.sword || given) return;
      given = true;
      gainSwords(1);
    },
  };
  const ways = wide ? [hero.face, -hero.face] : [hero.face];
  for (const face of ways) {
    const x = hero.x + face * 10;
    const y = hero.y - 4 - shape.half;
    game.fx.push(createQiWave(x, y, face, shape));
    const at = { x, y: hero.y - 18, face, reach: 18 * (v.tall ?? 1) };
    yunFx(SKILL.crescent, "slash", at, { damage: shape.damage, quiet: face !== hero.face, signature: CRESCENTS });
    if (v.twin) game.fx.push(createDelayed(TIDE_WAVE.twinDelay, () => game.fx.push(createQiWave(x, y, face, shape))));
  }
}
