import { feat } from "../../../game/feat";
import { moveDef } from "../../../game/hero/kits";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { BRYNN_STATS } from "../constants/achievements";
import { createCrescentWave } from "./effects/heavyWave";
import { brynnFx, CRESCENT } from "./fx";
import { heavyLanded } from "./heavy";
import { heftForBlow } from "./heft";
import { brynn } from "./state";

/** how far Horizon Cleave's crescents fly */
const HORIZON_REACH = 120;

/** Horizon Cleave (Wide Arc evolved): the sweep throws a crescent both ways */
function horizon(): void {
  const damage = progress.stats.ad * skillValues("br_cleave").wave;
  for (const face of [hero.face, -hero.face]) {
    const at = { x: hero.x + face * 12, y: hero.y - 14, face, reach: 20 };
    brynnFx("br_cleave", "slash", at, { damage, quiet: true, signature: CRESCENT });
    game.fx.push(
      createCrescentWave({ x: hero.x + face * 12, y: hero.y - 14, face, reach: HORIZON_REACH, damage, scale: 1.2 }),
    );
  }
}

/** a move's last blow is out: Heft for every foe it struck, a heavy swing's crescent and streak, the swings that hit
 *  harder after a parry counted down, and the sweep's crescents with Horizon Cleave */
export function afterStrike(id: string, hits: number): void {
  if (hero.hitIndex < moveDef(id).hits.length) return;
  heftForBlow(hits, hero.keen);
  if (brynn.afterParry > 0) brynn.afterParry--;
  if (hero.keen && hits > 0) heavyLanded();
  else brynn.heavyStreak = 0;
  if (id !== "sweep") return;
  if (hits > 0) {
    const damage = progress.stats.ad * (1 + (skillValues("br_cleave").power ?? 0));
    brynnFx(
      "br_cleave",
      "slash",
      { x: hero.x + hero.face * 12, y: hero.y - 16, face: hero.face, reach: 22 },
      { damage },
    );
    brynnFx("br_cleave", "nova", { x: hero.x + hero.face * 8, y: hero.y, reach: 22 }, { damage, quiet: true });
  }
  feat({ kind: "heroBest", stat: BRYNN_STATS.crowd, value: hits });
  if (skillEvolved("br_cleave")) horizon();
}
